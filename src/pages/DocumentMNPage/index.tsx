import {Button, Page, Text, View} from '@components';
import {Icon} from '@iconify/react';
import {DocumentMNService} from '@services';
import {useState} from 'react';
import {useTheme} from 'styled-components';
import DocumentEditor from './DocumentEditor';

function DocumentMNPage() {
  const theme = useTheme();
  const [selectedButton, setSelectedButton] = useState<'policy_and_terms' | 'introduction'>('policy_and_terms');

  return (
    <Page.Container>
      <Page.Content gap={16}>
        <View style={{position: 'sticky', top: 0, marginTop: -8, paddingTop: 8, paddingBottom: 8, backgroundColor: theme.colors.background, zIndex: 48}} horizontal>
          <View horizontal flex={1} gap={8}>
            <Button
              shadowEffect
              style={{width: 180}}
              selected={selectedButton === 'policy_and_terms'}
              onClick={() => setSelectedButton('policy_and_terms')}
            >
              <Icon icon={selectedButton === 'policy_and_terms' ? 'mingcute:document-fill' : 'mingcute:document-line'} style={{height: 20, width: 20, color: theme.colors.blue}} />
              <Text style={{marginLeft: 8, color: selectedButton === 'policy_and_terms' ? theme.colors.blue : theme.colors.foreground}}>Điều khoản</Text>
            </Button>
            <Button
              shadowEffect
              style={{width: 180}}
              selected={selectedButton === 'introduction'}
              onClick={() => setSelectedButton('introduction')}
            >
              <Icon icon={selectedButton === 'introduction' ? 'mingcute:leaf-3-fill' : 'mingcute:leaf-3-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
              <Text style={{marginLeft: 8, color: selectedButton === 'introduction' ? theme.colors.foreground : theme.colors.foreground}}>Giới thiệu</Text>
            </Button>
          </View>
        </View>
        <View>
          {selectedButton === 'policy_and_terms' && <DocumentEditor documentKey="policy_and_terms" documentFn={DocumentMNService.getPolicyAndTermsAsync} documentUpdateFn={DocumentMNService.updatePolicyAndTermsAsync}/>}
          {selectedButton === 'introduction' && <DocumentEditor documentKey="introduction" documentFn={DocumentMNService.getIntroductionAsync} documentUpdateFn={DocumentMNService.updateIntroductionAsync}/>}
        </View>
      </Page.Content>
    </Page.Container>
  );
}

export default DocumentMNPage;
