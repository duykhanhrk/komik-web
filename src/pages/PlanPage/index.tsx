import {Button, Card, Page, Text, View} from "@components";
import {PaymentMethod, Plan, PlanService, PurchaseService} from "@services";
import {FormEvent, useEffect, useState} from "react";
import {useQuery} from "react-query";
import ErrorPage from "../ErrorPage";
import LoadingPage from "../LoadingPage";
import {loadStripe} from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import './index.scss';
import {useNavigate} from "react-router";
import {useUserProfileQuery} from "@hooks";
import {useNotifications} from "reapop";
import {isAxiosError} from "axios";
import {error} from "console";


function PaymentMethodSelectionList({onSelectedItemChanged} : {onSelectedItemChanged?: (item: PaymentMethod) => void}) {
  const paymentMethods = PurchaseService.getAllPaymentMethods();
  const [selectedItem, setSelectedItem] = useState<PaymentMethod | undefined>(paymentMethods[0]);

  useEffect(() => {
    onSelectedItemChanged && selectedItem && onSelectedItemChanged(selectedItem);
  }, [selectedItem]);

  return (
    <View horizontal wrap gap={8} animation="slideRightIn">
      {paymentMethods.map((item: PaymentMethod) => (
        <Card
          shadowEffect
          style={{width: 340, height: 40, justifyContent: 'center', boxShadow: selectedItem?.key == item.key ? 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' : 'rgba(99, 99, 99, 0.0) 0px 0px 0px 0px'}}
          onClick={() => setSelectedItem(item)}
        >
          <Text variant="title">{item.name}</Text>
        </Card>
      ))}
    </View>
  )
}

function PlanSelectionList({onSelectedItemChanged} : {onSelectedItemChanged?: (item: Plan) => void}) {
  const [selectedItem, setSelectedItem] = useState<Plan | undefined>();

  const query = useQuery({
    queryKey: ['plans'],
    queryFn: PlanService.getAllAsync
  });

  useEffect(() => {
    if (query.data?.plans.length > 0) {
      setSelectedItem(query.data?.plans[0]);
    }
  }, [query.data])

  useEffect(() => {
    onSelectedItemChanged && selectedItem && onSelectedItemChanged(selectedItem);
  }, [selectedItem]);

  if (query.isLoading) {
    return null
  }

  if (query.isError) {
    return <ErrorPage />
  }

  return (
    <View horizontal wrap gap={8} animation="slideLeftIn" style={{minHeight: 300}} >
      {query.data.plans.map((item: Plan) => (
        <Card
          shadowEffect
          style={{width: 340, boxShadow: selectedItem?.id == item.id ? 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' : 'rgba(99, 99, 99, 0.0) 0px 0px 0px 0px'}}
          onClick={() => setSelectedItem(item)}
        >
          <Text variant="medium-title">{item.name}</Text>
          <Text>{item.value}</Text>
          <Text>{item.price}</Text>
          <Text>{item.description}</Text>
        </Card>
      ))}
    </View>
  )
}

const CheckoutForm = ({onSubmitted}: {onSubmitted: (token: string) => void}) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (elements == null) {
      return;
    }

    const stripResponse = await stripe!.createToken(elements.getElement(CardElement)!)

    onSubmitted(stripResponse.token?.id || '');
  };

  return (
    <form onSubmit={handleSubmit}>
      <View gap={8}>
        <CardElement/>
        <Button variant="primary" type="submit" disabled={!stripe || !elements}>Thanh toán</Button>
      </View>
    </form>
  );
};

function PlanPage() {
  const [plan, setPlan] = useState<Plan>();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>();
  const [processStatus, setProcessStatus] = useState<{isLoading: boolean, isError: boolean, error?: Error}>({isLoading: true, isError: false});
  const [stripePromise, setStripePromise] = useState<Promise<any>>();

  const query = useUserProfileQuery();
  const {notify} = useNotifications();

  const navigate = useNavigate();

  useEffect(() => {
    setProcessStatus({isLoading: true, isError: false});
    PurchaseService.getStripeKeyAsync()
      .then((response) => {
        console.log(response)
        setStripePromise(loadStripe(response.key))
        setProcessStatus({isLoading: false, isError: false});
      })
      .catch((error) => {
        setProcessStatus({isLoading: false, isError: true, error});
      })
  }, [])

  function cardPayment(token: string) {
    setProcessStatus({isLoading: true, isError: false});
    PurchaseService.paymentByCardAsync({plan_id: plan?.id || 0, token: token})
      .then(() => {
        query.refetch();
        navigate(-1);
        notify({
          title: 'Thành công',
          message: 'Thanh toán thành công!',
          status: 'success'
        });
      })
      .catch((error) => {
        if (isAxiosError(error) && error.response) {
          notify({
            title: 'Lỗi',
            message: error.response.data.message,
            status: 'error'
          });
        } else {
          notify({
            title: 'Lỗi',
            message: 'Thanh toán không thành công!',
            status: 'error'
          });
        }
      })
      .finally(() => {
        setProcessStatus({isLoading: false, isError: false});
      })
  }

  if (processStatus.isLoading) {
    return <LoadingPage />
  }

  if (processStatus.isError) {
    return <ErrorPage error={processStatus.error} />
  }

  return (
    <Page.Container>
      <Page.Content>
        <View horizontal gap={16}>
          <View gap={16} flex={1}>
            <View gap={8}>
              <Text variant="medium-title">Các gói</Text>
              <PlanSelectionList onSelectedItemChanged={(item) => setPlan(item)} />
            </View>
            <View gap={8}>
              <Text variant="medium-title">Phương thức thanh toán</Text>
              <PaymentMethodSelectionList onSelectedItemChanged={(item) => setPaymentMethod(item)} />
            </View>
          </View>
          <View gap={8}>
            <Text variant="medium-title">Thanh toán</Text>
            <Card style={{width: 340}} animation="slideTopIn">
              <Text><b>Tổng tiền: </b>{plan?.price}đ</Text>
              <Text><b>Phương thức thanh toán: </b>{paymentMethod?.name}</Text>
              <View>
                <Elements stripe={stripePromise || null}>
                  <CheckoutForm onSubmitted={cardPayment} />
                </Elements>
              </View>
            </Card>
          </View>
        </View>
      </Page.Content>
    </Page.Container>
  )
}

export default PlanPage;
