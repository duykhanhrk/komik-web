import {Button, Card, Grid, Page, Tag, Text, View} from '@components';
import {PaymentMethod, Plan, PlanService, PurchaseService} from '@services';
import {FormEvent, useEffect, useState} from 'react';
import {useQuery} from 'react-query';
import ErrorPage from '../ErrorPage';
import LoadingPage from '../LoadingPage';
import {loadStripe, Stripe, StripeError} from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import './index.scss';
import {useNavigate} from 'react-router';
import {useUserProfileQuery} from '@hooks';
import {useNotifications} from 'reapop';
import {isAxiosError} from 'axios';
import {Icon} from '@iconify/react';
import {useTheme} from 'styled-components';


function PaymentMethodSelectionList({onSelectedItemChanged} : {onSelectedItemChanged?: (item: PaymentMethod) => void}) {
  const paymentMethods = PurchaseService.getAllPaymentMethods();
  const [selectedItem, setSelectedItem] = useState<PaymentMethod | undefined>(paymentMethods[0]);

  const theme = useTheme();

  useEffect(() => {
    onSelectedItemChanged && selectedItem && onSelectedItemChanged(selectedItem);
  }, [selectedItem]);

  return (
    <Grid templateColumns="auto auto" gap={8} animation="slideLeftIn">
      {paymentMethods.map((item: PaymentMethod) => (
        <Card
          key={item.key}
          shadowEffect
          horizontal
          style={{alignItems: 'center', gap: 8, boxShadow: selectedItem?.key == item.key ? 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' : 'rgba(99, 99, 99, 0.0) 0px 0px 0px 0px'}}
          onClick={() => setSelectedItem(item)}
        >
          <View style={{height: 64, width: 64}}>
            <Icon icon={'mingcute:bank-card-line'} style={{height: 64, width: 64, color: theme.colors.foreground}} />
          </View>
          <View gap={4}>
            <Text variant="title">{item.name}</Text>
            <Text variant="small" style={{textAlign: 'justify'}}>
            Chúng tôi cam kết bảo mật thông tin cá nhân và thông tin thanh toán của người dùng. Tất cả dữ liệu sẽ được mã hóa và xử lý thông qua các kênh bảo mật, đảm bảo an toàn tuyệt đối cho giao dịch của người dùng
            </Text>
          </View>
        </Card>
      ))}
    </Grid>
  );
}

function PlanSelectionList({onSelectedItemChanged} : {onSelectedItemChanged?: (item: Plan) => void}) {
  const [selectedItem, setSelectedItem] = useState<Plan | undefined>();

  const theme = useTheme();

  const query = useQuery({
    queryKey: ['plans'],
    queryFn: PlanService.getAllAsync
  });

  useEffect(() => {
    if (query.data && query.data.length > 0) {
      setSelectedItem(query.data![0]);
    }
  }, [query.data]);

  useEffect(() => {
    onSelectedItemChanged && selectedItem && onSelectedItemChanged(selectedItem);
  }, [selectedItem]);

  if (query.isLoading) {
    return null;
  }

  if (query.isError) {
    return <ErrorPage />;
  }

  return (
    <Grid templateColumns="auto auto"  gap={8} animation="slideRightIn" style={{minHeight: 300}} >
      {query.data!.map((item: Plan) => (
        <Card
          key={item.id}
          shadowEffect
          style={{boxShadow: selectedItem?.id == item.id ? 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' : 'rgba(99, 99, 99, 0.0) 0px 0px 0px 0px'}}
          onClick={() => setSelectedItem(item)}
        >
          <Text variant="title">{item.name}</Text>
          <Text variant="small" style={{textAlign: 'justify'}}>{item.description}</Text>
          <View flex={1} horizontal gap={4} style={{justifyContent: 'flex-end', alignItems: 'flex-end'}}>
            <Tag variant={{ct: 'tertiary'}} style={{gap: 9, color: theme.colors.idigo}}>
              <Icon icon={'mingcute:calendar-day-line'} style={{height: 16, width: 16, color: theme.colors.idigo}} />
              {item.value / 24} ngày
            </Tag>
            <Tag variant={{ct: 'tertiary'}} style={{gap: 8, color: theme.colors.idigo}}>
              <Icon icon={'mingcute:wallet-4-line'} style={{height: 16, width: 16, color: theme.colors.idigo}} />
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
            </Tag>
          </View>
        </Card>
      ))}
    </Grid>
  );
}

const CheckoutForm = ({onSubmitted}: {onSubmitted: (token: string) => void}) => {
  const stripe = useStripe();
  const elements = useElements();
  const theme = useTheme();
  const {notify} = useNotifications();

  const [isError, setIsError] = useState(true);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (elements == null) {
      return;
    }

    if (isError) {
      notify({
        title: 'Lỗi',
        message: 'Vui lòng nhập đầy đủ thông tin',
        status: 'error'
      });

      return;
    }


    const stripResponse = await stripe!.createToken(elements.getElement(CardElement)!);

    onSubmitted(stripResponse.token?.id || '');
  };

  return (
    <form onSubmit={handleSubmit}>
      <View gap={8}>
        <Card variant="tertiary" style={{paddingTop: 12, paddingBottom: 12}}>
          <CardElement options={{
            hidePostalCode: true,
            style: {
              base: {
                fontSize: '1.0em',
                color: theme.colors.foreground,
                '::placeholder': {
                  color: theme.colors.quinaryForeground
                },
                backgroundColor: theme.colors.background,
                padding: '8px 12px',
              },
              invalid: {
                color: theme.colors.red,
              }
            },
          }}
          onChange={(event) => {
            if (event.error) {
              setIsError(true)
            } else {
              setIsError(false)
            }
          }}
          />
        </Card>
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
  const theme = useTheme();

  useEffect(() => {
    setProcessStatus({isLoading: true, isError: false});
    PurchaseService.getStripeKeyAsync()
      .then((response) => {
        console.log(response);
        setStripePromise(loadStripe(response.key, {locale: 'vi'}));
        setProcessStatus({isLoading: false, isError: false});
      })
      .catch((error) => {
        setProcessStatus({isLoading: false, isError: true, error});
      });
  }, []);

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
      });
  }

  if (processStatus.isLoading) {
    return <LoadingPage />;
  }

  if (processStatus.isError) {
    return <ErrorPage error={processStatus.error} />;
  }

  return (
    <Page.Container>
      <Page.Content>
        <View horizontal gap={16}>
          <View gap={32} flex={1}>
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
            <Card style={{width: 340, gap: 8}} animation="slideTopIn">
              <View horizontal gap={4}>
                <Tag variant={{ct: 'tertiary'}} style={{gap: 8, color: theme.colors.idigo}}>
                  <Icon icon={'mingcute:wallet-4-line'} style={{height: 16, width: 16, color: theme.colors.idigo}} />
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(plan?.price || 0)}
                </Tag>
                <Tag variant={{ct: 'tertiary'}} style={{gap: 8}}>
                  <Icon icon={'mingcute:bank-card-line'} style={{height: 16, width: 16, color: theme.colors.foreground}} />
                  {paymentMethod?.key == 'card' ? 'Master/Visa' : 'Không rõ'}
                </Tag>
              </View>
              <Elements stripe={stripePromise || null}>
                <CheckoutForm onSubmitted={cardPayment} />
              </Elements>
            </Card>
          </View>
        </View>
      </Page.Content>
    </Page.Container>
  );
}

export default PlanPage;
