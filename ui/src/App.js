import {Layout} from 'antd';
import styled from 'styled-components';
import NlpView from './NlpView';

const CustomLayout = styled(Layout)`
  min-height: 100%;
  display: flex;
  & > * { flex: 0 1 auto; }
  & > .content { flex: 1 0 auto; }
`;

const Header = styled(Layout.Header)`
  background: #343a40;
  color: #fff;
  & * {
    color: #fff;
  }
`;

const ContentWrapper = styled(Layout.Content)`
  margin: 20px;
  background: #fff;
`;

const Content = styled.div`
`;

const Footer = styled(Layout.Footer)`
  font-size: 0.9em;
`;

const App = () => (
  <CustomLayout className="layout">
    <Header>
      <h2>NLP-PIPE: Latvian NLP Pipeline as a Service</h2>
    </Header>
    <ContentWrapper className='content'>
      <Content>
        <NlpView/>
      </Content>
    </ContentWrapper>
    <Footer>
      <p>This work is supported by the European Regional Development Fund under the grant agreement No. 1.1.1.1/16/A/219 (<a href="https://github.com/LUMII-AILab/FullStack">Full Stack of Language Resources for Natural Language Understanding and Generation in Latvian</a>) and by the State Research Programme under the grant agreement No. VPP-IZM-DH-2020/1-0001 (<a href="http://www.digitalhumanities.lv/projects/DHVPP-en/">Digital Resources for Humanities: Integration and Development</a>).</p>
      <p>Source code available via <a href="https://github.com/LUMII-AILab/nlp-pipe">https://github.com/LUMII-AILab/nlp-pipe</a> </p>
      <p style={{marginBottom: 0}}>Publications:</p>
      <ul>
        <li>A. Znotins and E. Cirule, NLP-PIPE: Latvian NLP Tool Pipeline, <i>Human Language Technologies -- The Baltic Perspective</i>, IOS Press, 2018, (<a href="http://ebooks.iospress.nl/volumearticle/50320">PDF</a>, <a href="http://dx.doi.org/10.3233/978-1-61499-912-6-183">DOI</a>, <a href="http://ailab.lv/publications/411/?bibtex">BibTeX</a>)</li>
        <li>N. Gruzitis and A. Znotins , Multilayer Corpus and Toolchain for Full-Stack NLU in Latvian, <i>Proceedings of the CLARIN Annual Conference 2018</i>, 2018, (<a href="https://office.clarin.eu/v/CE-2018-1292-CLARIN2018_ConferenceProceedings.pdf">PDF</a>, <a href="http://ailab.lv/publications/413/?bibtex">BibTeX</a>)</li>
      </ul>
      <img src="/projects.png" style={{width: '100%', maxWidth: 500}} alt="Projects" />
    </Footer>
  </CustomLayout>
);

export default App;
