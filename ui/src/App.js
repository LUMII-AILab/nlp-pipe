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
  font-size: 1.0em;
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
    <ContentWrapper style={{margin: "0px 20px 20px 20px", background: "#f0f2f5"}}>
      <table style={{border: 0, padding: 0}}><tbody><tr><td>
      <p>This work is supported by the European Regional Development Fund under the grant agreement No. 1.1.1.1/16/A/219 (<a href="https://github.com/LUMII-AILab/FullStack">Full Stack of Language Resources for Natural Language Understanding and Generation in Latvian</a>) and by the State Research Programme under the grant agreement No. VPP-IZM-DH-2020/1-0001 (<a href="http://www.digitalhumanities.lv/projects/DHVPP-en/">Digital Resources for Humanities: Integration and Development</a>) in synergy with <a href="https://clarin.lv/en-us/">CLARIN-LV</a>.</p>
      <p>Source code of NLP-PIPE available via a public <a href="https://github.com/LUMII-AILab/nlp-pipe">GitHub repository</a>.</p>
      <p style={{marginBottom: 0}}>Publications:</p>
      <ul>
        <li>Znotiņš, A. and Cīrule, E. NLP-PIPE: Latvian NLP Tool Pipeline. <i>Human Language Technologies - The Baltic Perspective</i>, IOS Press, 2018 (<a href="http://ebooks.iospress.nl/volumearticle/50320">PDF</a>, <a href="http://ailab.lv/publications/411/?bibtex">BibTeX</a>)</li>
        <li>Grūzītis, N. and Znotiņš, A. Multilayer Corpus and Toolchain for Full-Stack NLU in Latvian. <i>Proceedings of the CLARIN Annual Conference</i>, 2018 (<a href="https://office.clarin.eu/v/CE-2018-1292-CLARIN2018_ConferenceProceedings.pdf">PDF</a>, <a href="http://ailab.lv/publications/413/?bibtex">BibTeX</a>)</li>
      </ul>
      <p>&copy; <a href="http://ailab.lv/en/">Artificial Intelligence Laboratory</a> | Institute of Mathematics and Computer Science, University of Latvia</p>
      </td><td style={{width: "20px"}}></td><td style={{background: "#fff"}}>
      <img src="/projects.png" style={{minWidth: 500, maxWidth: 500}} alt="Projects" />
      </td></tr></tbody></table>
    </ContentWrapper>
  </CustomLayout>
);

export default App;
