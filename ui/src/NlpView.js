import {useCallback, useState} from 'react';
import {Button, Input, Radio, Card, Select, Spin} from 'antd';
import {run_nlp} from './api';

let sampleTexts = [
    [
        'Lielbritānijas \'British Steel\' vēlas iegādāties visu \'KVV Liepājas metalurgu\' | LETA',
`Lielbritānijas uzņēmuma "British Steel" vadīts konsorcijs atkārtoti paudis vēlmi iegādāties visu maksātnespējīgās AS "KVV Liepājas metalurgs" mantu kopumā, liecina aģentūras LETA rīcībā esoša "British Steel" vēstule.
Konsorcijs, kurā ietilpst Lielbritānijas uzņēmumi "British Steel", "Greybull Capital" un Igaunijas uzņēmums "Baltic Metal Holding" 17. aprīlī vēstulē "KVV Liepājas metalurga" administratorei Vitai Dikai, Privatizācijas aģentūras meitasuzņēmuma "FeLM" valdes loceklim Jānim Rībenam un bankai "Citadele" apliecinājis savu ieinteresētību iegādāties visus maksātnespējīgā uzņēmuma aktīvus kopumā.
Aģentūras LETA rīcībā esoša informācija liecina, ka "British Steel" konsorcijs vēlmi iegādāties visu uzņēmumu kopumā ir paudis arī šā gada februārī, nosūtot vēstuli atbildīgajām personām. Februārī "British Steel" norādīja, ka ražošanas atjaunošanai būtu nepieciešams nomainīt novecojušo velmētavas iekārtu un informēja, ka būtu gatavi investēt 60 līdz 75 miljonus eiro velmētavas iekārtu nomaiņā.
Vēstulē teikts, ka "British Steel" konsorcijs ir gatavs parakstīt nodomu protokolu ar pašreizējiem "KVV Liepājas metalurga" īpašniekiem par uzņēmuma aktīvu iegādi.
Tāpat "British Steel" aicina "KVV Liepājas metalurga" maksātnespējas administratori atcelt visas notikušās un izsludinātās mantas izsoles, lai saglabātu uzņēmuma aktīvus kā vienotu kopumu.
Tiklīdz nodomu protokolu būs parakstījušas visas iesaistītās puses, "British Steel" konsorcijs gatavs iemaksāt depozītu, lai pieradītu savas saistības un nodomus uzņēmuma iegādē.
"KVV Liepājas metalurga" maksātnespējas administratore Dika atteicās atbildēt uz jautājumiem par "British Steel" nosūtīto vēstuli un tajā pausto vēlmi iegādāties "KVV Liepājas metalurgs" mantu kopumā.
Londonā bāzētā investīciju kompānija "Greybull Capital" dibināta 2008. gadā un nodarbojas ar ilgtermiņa investīcijām privātās kompānijās. "Greybull Capital" specializējas tā dēvētajos "glābšanas darījumos" un kompānijas investīciju portfelī ietilpst enerģijas, tehnoloģiju, mazumtirdzniecības, rūpniecības un ražošanas daļas.
"Greybull Capital" iegādājās kompānijas "Tata Steel UK" tērauda rūpnīcu Skantorpā un divas rūpnīcas Tīsaidā. Skantorpas ražotne, kas iepriekš bija "Tata Long Products Europe" nodaļa, tika pārdēvēts par "British Steel".
Jau ziņots, ka Austrijas uzņēmums "Smart Stahl GmbH" 20. martā uzvarēja "KVV Liepājas metalurga" velmētavas ceha kustamās mantas izsolē ar piedāvāto cenu 1,57 miljoni eiro bez pievienotās vērtības nodokļa (PVN) jeb 1,9 miljoni eiro ar PVN.
Savukārt 28. martā "KVV Liepājas metalurga" elektrotēraudkausēšanas ceha un tajā esošās kustamās mantas - elektrotēraudkausēšanas krāsns - elektroniskā izsole atzīta par nenotikušu, jo tajā nepieteicās neviens pretendents. Elektrotēraudkausēšanas ceha un iekārtu kā lietu kopības pirmās izsoles sākumcena bija noteikta 5,35 miljonu eiro apmērā.
Marta beigās noslēdzās divu "KVV Liepājas metalurgs" nekustamo īpašumu izsoles. Īpašums Brīvības ielā 100B ir nosolīts par 82 000 eiro, bet īpašums Brīvības ielā 94A nosolīts par 116 000 eiro.
Tāpat ir izsludinātas dažādu "KVV Liepājas metalurga" nekustamo īpašumu izsoles, kurām jānoslēdzas 20.aprīlī. Kopumā izsludinātas 11 izsoles, un tajās izsolāmo nekustamo īpašumu kopējā sākumcena ir 1,745 miljoni eiro.
"KVV Liepājas metalurgs" par maksātnespējīgu tika pasludināts 2016. gada septembrī.`
    ],
    [
        '\'Lidl\' lielā slepenībā apstiprina ienākšanu Latvijā | DELFI',
`Veikals "Lidl" oficiāli apstiprinājis ienākšanu Latvijā, pērk zemesgabalus un meklē darbiniekus, taču konkrētus plānus glabā lielā slepenībā. Portāls "Delfi" noskaidroja, ka līdztekus vairākiem veikaliem Rīgā "Lidl" noskatījis arī Liepāju un Jūrmalu.
Lietuvas uzņēmuma "Lidl Lietuva" korporatīvo attiecību un komunikācijas vadītājs Valds Lopeta, kurš vienlaikus pārstāv veikalu "Lidl" visā Baltijā, portālam "Delfi" apstiprina, ka uzņēmums ienāks Latvijā.
"Mēs plānojam ienākt Latvijas tirgū. Pieņemam un vēlamies nodrošināt, ka vietējā ekonomika, piegādātāji un patērētāji iegūs no mūsu ienākšanas. Šobrīd "Lidl" pēta potenciālās veikalu atrašanās vietas Latvijā. Taču šobrīd ir pāragri spriest par konkrētiem plāniem," portālam "Delfi" pauž Lopeta. Viņš atteicās precizēt, kad pirmie "Lidl" veikali varētu vērt durvis.
Konkretizēt "Lidl" plānus atteicās arī par veikala ienākšanu Latvijā atbildīgās SIA "MMS Property Solutions" valdes priekšsēdētājs Mārtiņš Sprūdžs. "Šī informācija ir konfidenciāla. Ņemot vērā sīvo konkurenci Latvijā, šo informāciju nav nepieciešams sniegt publiski, lai to kāds neizmantotu. Tas nav nekas vairāk kā biznesa specifika. Sevišķi pašā sākumā šādu informāciju nesniegsim. Kad paies noteikts laiks un tiks atvērti pirmie veikali, tad varbūt. Bet, kamēr tas nav noticis, šādu informāciju neviens neizpaudīs," portālam "Delfi" stāsta Sprūdžs, kurš "Lidl" pirmo mēģinājumu ienākt Latvijā laikā vadīja SIA "Lidl Latvija" nekustamā īpašuma departamentu.
"Lidl" Somijas meitasuzņēmuma vadītājs Lauri Siponens pērn septembrī somu medijiem pauda, ka veikals Latvijā un Igaunijā varētu ienākt nākamajā desmitgadē, proti, ne ātrāk par 2020. gadu.`
    ],
    [
        'Gaidot \'Phjončhanu 2018\': Kanādas olimpiskā hokeja izlase ceļu pēc zelta sāk Latvijā | DELFI',
`Phjončhanas olimpisko spēļu hokeja turnīrs būs unikāls ar to, ka nevienā izlasē nespēlēs spēlētāji no Nacionālās hokeja līgas (NHL), tāpēc šī sporta veida lielvalstij Kanādai nācās meklēt labākos pieejamos spēlētājus Eiropā. Kanādas valstsvienība savu sastāvu Phjončahanas spēlēm jau paziņojusi, bet pēdējo sagatavošanos posmu aizvada Rīgā.
Kanādas izlase pirms olimpiskajām spēlēm arī aizvadīs pārbaudes spēli ar Latvijas valstsvienību. No līdzjutēju puses par šo maču esot ļoti liela interese, tāpēc sagaidāms, ka "Arēnā Rīga" atmosfēra būs lieliska. Kanādas hokejisti savus treniņus aizvada "Inbox.lv" ledus hallē Piņķos, un pēc trešdienas treniņa ģenerālmenedžeris Šons Burks pamatoja, kāpēc viņi trenējas tieši šeit.
"Rīga ir skaista pilsēta. Mums izlasē ir 13 spēlētāji no Kontinentālās hokeja līgas (KHL) komandām, tāpēc Rīga bija ērta pilsēta tādā ziņā. Šeit ir laba treniņu vieta, mums ir labas attiecības ar Latvijas Hokeja federāciju (LHF) un mēs šeit esam bijuši iepriekš. Šeit vienmēr ir labi apstākļi un labi hokeja fani," Latvijas žurnālistiem teica Burks.
Kanādas izlasē iekļauts Rīgas "Dinamo" aizsargs Karls Stolerijs, bet uz vietu pretendēja arī uzbrucējs Brendons Makmilans. Tāpat sezonas laikā no "Dinamo" atlaistais vārtsargs Džastins Pīterss brauks uz Phjončhanu.
"Ziņu par iekļūšanu izlasē saņēmu janvārī pēc spēles mājās ar Kazaņas "Ak Bars". Pēc spēles telefonā redzēju, ka man atstāta ziņa un ka esmu iekļuvis komandā. Biju sajūsmināts un nevarēju atrast īstos vārdus. Tā būs lieliska pieredze, un pārstāvēt savu valsti būs gods," neslēpa Stolerijs.
Aizsargs ar vairākiem Kanādas izlases komandas biedriem kopā spēlējis jau iepriekš, tāpat viņš saviem tautiešiem izrādījis savas iecienītākās vietas Rīgā.
"Spēle pret Latvijas izlasi būs interesanta," turpināja Stolerijs. "Būs dīvaini spēlēt pret saviem Rīgas "Dinamo" komandas biedriem, bet mačs būs labs un fani būs sajūsmināti. Olimpiskajās spēlēs cīņas būs ļoti līdzīgas, mēs mēģināsim aizstāvēt Kanādas godu un atkal izcīnīt zelta medaļas."
"Stolerijs ir mobils aizsargs, kurš var spēlēt abos laukuma galos. Tieši šī iemesla dēļ mēs viņu ievērojām un iekļāvām izlasē. Mēs ar viņu rēķināmies," Rīgas "Dinamo" aizsarga iekļaušanu izlasē pamatoja Kanādas izlases galvenais treneris Villijs Dežardēns.
Dežardēnam svētdien atkal būs iespēja spēlēt pret sava kolēģa Boba Hārtlija vadīto komandu. Abiem iepriekš bijuši dueļi NHL, tāpēc viņš ir pārliecināts, ka spēle būs aizraujoša.
"Mums vēl jāstrādā pie daudziem spēles aspektiem. Spēlētāji darbojas enerģiski, man tas patīk. Protams, ka viņi nogurst no treniņiem, tāpēc viņi vēlas pēc iespējas ātrāk sākt spēlēt. Bobs ir ļoti labs treneris. Viņa vadītās komandas vienmēr spēlē labi. Tā būs līdzīga spēle, viņi vēlas mājās nospēlēt labi. Mums viegli nebūs," par Rīgā gaidāmo maču izteicās treneris.
"Mums kopā vēl jāpavada laiks, lai saspēlētos. Mēs necenšamies izdomāt kaut kādas jaunas sistēmas, slīpējam spēles pamatelementus, kurus spēlētāji zina. Mēs vēl visi neesam bijuši kopā, tāpēc ir grūti spriest par mūsu stiprajām vai vājajām pusēm. Man patīk mūsu aizsardzības līnija, jo tā var pieturēt ripu. Mēs spēlēsim smagi, neatlaidīgi un ar lielu enerģiju," turpinājumā teica Dežardēns.
Burks uzsvēra, ka spēlētāji ir ļoti priecīgi pārstāvēt savu valsti, jo viņiem iepriekš tāda iespēja nav bijusi. Kanādas izlases ģenerālmenedžeris arī norādīja, ka nespēj nosaukt vienu komandu, kas būs galvenā medaļu pretendente: "Ir vairākas komandas. Protams, ka Krievijai būs laba komanda, un viņus var uzskatīt par favorītiem. Arī mums būs iespēja uzvarēt. Turnīrs būs līdzīgs." Viņa viedoklim piekrita arī Dežardēns.
Kanādā vienmēr no izlases sagaida medaļas, un Burks to apzinās. Tāpat ģenerālmenedžeris stāstīja, ka spēlētāji bija ļoti pagodināti, kad viņiem paziņoja par iekļūšanu izlases sastāvā. "Viņiem tas bija emocionāls mirklis, kas mums sniedza gandarījumu," teica Burks.`
    ],
    [
        'Saeimā sākas virzība grozījumiem par pakāpenisku pāreju uz mācībām latviešu valodā | LETA',
`Saeima ceturtdien nodeva izskatīšanai komisijās likumu grozījumus, kas paredz no 2019.gada 1.septembra vispārējās izglītības iestādēs sākt pakāpenisku pāreju uz mācībām latviešu valodā.
Deputāts Hosams Abu Meri (V) debatēs uzsvēra, ka šis ir valsts pašcieņas un pastāvēšanas jautājums. Viņš skaidroja, ka izmaiņas nepieciešamas, lai nodrošinātu kvalitatīvu izglītību. Tāpat būtiski, lai Latvijas iedzīvotāji nedzīvotu "divās paralēlās pasaulēs", atšķirīgās mediju telpās. "Šeit ir Latvija," sacīja deputāts, akcentējot, ka latviešu valoda "bija, ir un būs vienīgā valsts valoda".
Savukārt deputāts Igors Pimenovs (S) aicināja neatbalstīt šādas izmaiņas, uzsverot, ka šis ir otrais mazākumtautību mācību latviskošanas vilnis. Pimenovs norādīja uz pieprasījumu pēc izglītības krievu valodā, kā arī uzsvēra, ka vecākiem ir pamatotas tiesības prasīt, lai no viņu samaksātajiem nodokļiem tiktu nodrošinātas apmācības arī mazākumtautību valodās.
Grozījumus Vispārējās izglītības likumā šodien atbalstīja 66 deputāti, pret balsoja 21 parlamentārietis, bet Juris Viļums (LRA) balsojumā nepiedalījās. Savukārt grozījumus Izglītības likumā atbalstīja 67 deputāti, pret bija 21 deputāts, bet Viļums balsojumā nepiedalījās.
Iepriekš valdībā atbalstītie grozījumi Izglītības likumā un Vispārējās izglītības likumā paredz iekļaut nosacījumus, kas jāsasniedz, lai nodrošinātu pāreju uz mācībām latviešu valodā, pārmaiņas noslēdzot 2021./2022.mācību gadā.
Pirmsskolā, sākot no piecu gadu vecuma, 2018./2019.mācību gadā tiks sākta jauno izglītības vadlīniju ieviešana, kas paredz būtiski palielināt latviešu valodas lomu mācīšanās procesā, nodrošinot mazākumtautību bērnu sekmīgu integrāciju sākumskolā.
Pakāpenisku pāreju uz mācībām latviešu valodā plānots sākt 2019./2020.mācību gadā - tad ir paredzēts sākt pāreju no esošajiem pieciem mazākumtautību izglītības modeļiem uz jauniem trim mazākumtautību izglītības modeļiem pamatizglītībā. Šajā pašā gadā tiks sākta secīga pāreja uz jaunu bilingvālās izglītības modeli 7.-9.klasēs, paredzot, ka ne mazāk kā 80% no mācību satura tiek mācīti valsts valodā, ieskaitot svešvalodas. Tāpat 2019./2020.mācību gadā valsts pārbaudījumi 9.klasēm notiks tikai latviešu valodā,
No 2020./2021.mācību gada vispārējās izglītības iestādēs 10. un 11.klasē visi vispārizglītojošie priekšmeti tiks pasniegti latviešu valodā, saglabājot mazākumtautību skolēniem iespēju dzimtajā valodā apgūt mazākumtautību valodu, literatūru un ar kultūru un vēsturi saistītus priekšmetus (moduļus).
Gadu vēlāk - no 2021./2022. mācību gada visā vidusskolas posmā visi vispārizglītojošie priekšmeti tiks mācīti latviešu valodā, tāpat saglabājot mazākumtautību skolēniem iespēju dzimtajā valodā apgūt mazākumtautību valodu, literatūru un ar kultūru un vēsturi saistītus priekšmetus (moduļus).
Ņemot vērā, ka kontekstā ar plānoto mācību procesa plānojumu vidusskolā un vispārējās vidējās izglītības mērķi sagatavot jauniešus sekmīgām studijām augstskolā ir paredzēts neturpināt vidusskolas posmā īstenot mazākumtautību izglītības programmas, Izglītības likuma grozījumos attiecīgi paredzēts noteikt, ka 1.-6.klases posmā mazākumtautību izglītības programmās mācību satura apguve valsts valodā tiek nodrošināta ne mazāk kā 50% apjomā no kopējās mācību stundu slodzes mācību gadā, ieskaitot svešvalodas, 7.-9.klases posmā - ne mazāk kā 80% apjomā no kopējās mācību stundu slodzes mācību gadā, ieskaitot svešvalodas. Attiecībā uz svešvalodu apguvi līdz ar to tiek noteikts, ka svešvalodas apguvē kā starpniekvaloda ir lietojama valsts valoda.
Vienlaikus ir plānots, ka Ministru kabineta noteikumos par valsts pamatizglītības standartu 1.-6.klases posmam tiks noteikti trīs izglītības programmu paraugi mazākumtautību izglītības programmu īstenošanai, kuros, ievērojot likuma nosacījumus, tiks piedāvāti trīs dažādi valsts valodas un mazākumtautības valodu lietojuma proporcijas modeļi un ir paredzēts, ka izglītības iestāde īstenošanai varēs izvēlēties vienu no tiem.
Grozījumi precizē arī procentuālo īpatsvaru no kopējā mazākumtautību izglītības programmu izglītojamo skaita tiem izglītojamajiem, kuru pedagogu darba samaksas finansēšanai var papildus piešķirt valsts budžeta mērķdotāciju, ņemot vērā, ka pēc likuma spēkā stāšanās šajā aprēķinā varēs iekļaut tikai mazākumtautību izglītības programmās pamatizglītības posma izglītojamos.
Vispārējās izglītības likuma grozījumi nosaka, ka vidusskolas posmā tiek izveidota vienota vispārējās vidējās izglītības programma visām izglītības iestādēm. Tāpat tiek paredzēta iespēja izglītības iestādēm turpināt mācīt mazākumtautības dzimto valodu un ar mazākumtautību identitāti un integrāciju Latvijas sabiedrībā saistītu mācību saturu.
Izglītības un zinātnes ministrs Kārlis Šadurskis (V) iepriekš uzsvēra, ka latviešu valoda un kultūra reizē ir arī Latvijas sabiedrību vienojošais pamats, tādēļ sabiedrības, kā arī valsts mērķis ir kopt valodu un gādāt par nacionālās identitātes, pilsoniskās sabiedrības un sabiedrības integrācijas vērtībām ilgtermiņā. Īstenojot pāreju uz mācībām valsts valodā vidusskolā, Šadurska ieskatā tiks stiprināta valsts valodas loma Latvijā, arī turpmāk nodrošinot dažādu tautību Latvijas iedzīvotāju nacionālo kultūru savdabību un attīstību.
Tāpat Šadurskis solīja, ka Izglītības un zinātnes ministrija (IZM) atbildīgi pildīs uzņemtās starptautiskās saistības mazākumtautību izglītības nodrošināšanā un attīstībā, tai skaitā nodrošinot nepieciešamo finansējumu tām izglītības iestādēm, kuras saskaņā ar starptautiskajiem līgumiem īsteno mazākumtautību izglītības programmas.
IZM skaidroja, ka pārmaiņu mērķis ir nodrošināt ikvienam bērnam Latvijā līdzvērtīgas iespējas iegūt kvalitatīvu izglītību, kas veicina 21.gadsimtā nepieciešamo zināšanu, prasmju un attieksmju apguvi. Jaunais mācību valodas regulējums paplašinās mazākumtautību jauniešu iespējas profesionālajā un augstākajā izglītībā, kur mācības notiek latviešu valodā, kā arī viņu konkurētspēju darba tirgū.
Ministrija rosinājusi būtiskas pārmaiņas vispārējās izglītības pieejā Latvijā, lai pirmo reizi vienotā sistēmā un pēctecīgi visos izglītības posmos pārskatītu mācību saturu un mācīšanas veidu, kādā skolotāji sadarbojoties organizē un vada skolēnu mācīšanos ikdienā, tajā skaitā mazākumtautību skolēniem. Pāreja uz mācībām valsts valodā vidusskolas posmā vispārējās izglītības iestādēs IZM ieskatā sekmēs jaunā vispārējās izglītības satura un mācīšanās pieejas ieviešanu.
Pērn tika nolemts, ka jau šajā mācību gadā 12.klases centralizētie eksāmeni notiks tikai latviešu valodā.
IZM valsts sekretāra vietniece Gunta Arāja iepriekš atgādināja, ka Latviešu valodas aģentūras pētījums liecina, ka, lai gan mazākumtautību jauniešiem ir latviešu valodas prasmes, daļai jauniešu tās ir tikai pamatprasmes vai vājā līmenī.
Arāja skaidroja, ka pārmaiņas mācību valodā tiks īstenotas līdztekus jaunā mācību satura ieviešanai, kā arī jau apstiprinātajām izmaiņām valsts pārbaudījumu un centralizēto eksāmenu norises kārtībā.
Arāja uzsvēra, ka pedagogu kompetences pilnveidei un atbalstam būs pieejami vairāki atbalsta pasākumi. No valsts pamatbudžeta 2018.-2020.gadam būs pieejami aptuveni 3,6 miljoni eiro, lai nodrošinātu atbalstu pedagogiem saistībā ar jaunā vispārējās izglītības satura ieviešanu. Savukārt no Eiropas Savienības fondiem būs pieejami aptuveni 3,299 miljoni eiro aptuveni 8000 pedagogiem, kas strādā mazākumtautību izglītības programmās vai lingvistiski neviendabīgā vidē. Šie līdzekļi būs pieejami valsts valodas prasmes līmeņa diagnostikai, kursiem latviešu valodas prasmes līmeņa paaugstināšanai, valsts valodas prasmes pārbaudēm, metodikas kursiem, citiem mācību pasākumiem, rokasgrāmatām un pedagogu portfolio mācību īstenošanai latviešu valodā, kā arī didaktiskajiem materiāliem mācībām pirmsskolas izglītībā.`
    ],

];

const NerComponent = ({data}) => {
  let sentences = data.sentences.map((sent, sentIdx) => {
      let entities = sent.ner || [];
      let res = [];
      let currentEntity = null;
      let currentEntityTokens = [];
      let nextEntityIdx = 0;
      sent.tokens.forEach((tok, tokIdx) => {
          if (currentEntity && currentEntity.end === tokIdx) {
              res.push(<span key={`ner-${sentIdx}-${tokIdx}`} className={`ner ${currentEntity.label}`} data-entity={currentEntity.label}>{currentEntityTokens}</span>);
              res.push(' ');
              currentEntity = null;
              currentEntityTokens = [];
          }
          if (nextEntityIdx < entities.length && entities[nextEntityIdx].start === tokIdx) {
              currentEntity = entities[nextEntityIdx];
              nextEntityIdx++;
          }
          if (currentEntity) {
              currentEntityTokens.push(tok.form);
              currentEntityTokens.push(' ');
          } else {
              res.push(tok.form);
              res.push(' ');
          }
      });
      if (currentEntity) {
          res.push(<span key={`ner-${sentIdx}-last`} className={`ner ${currentEntity.label}`} data-entity={currentEntity.label}>{currentEntityTokens}</span>);
          res.push(' ');
      }
      return <div key={sentIdx} className='sentence'>{res}</div>
  });

  return (
    <div className={'ner-text'}>
      {sentences}
    </div>
  )
};

const Conll = ({data}) => (
  <div>
    <table className="conll">
      <thead>
      <tr>
        <th>INDEX</th>
        <th>FORM</th>
        <th>LEMMA</th>
        <th>UPOSTAG</th>
        <th>XPOSTAG</th>
        <th>FEATS</th>
        <th>HEAD</th>
        <th>DEPREL</th>
      </tr>
      </thead>
      <tbody>
      {data.sentences.map((sentence, idx) =>
        [
          <tr key={`${idx}`}>
            <td colSpan="100"><br/>#text={sentence.tokens.map(e => e.form).join(' ')}</td>
          </tr>,
          (sentence.tokens.map((token, tIdx) => <tr key={`${idx}-${tIdx}`}>
            <td>{token.index}</td>
            <td>{token.form}</td>
            <td>{token.lemma}</td>
            <td>{token.upos}</td>
            <td>{token.tag}</td>
            <td style={{maxWidth: 100, overflowX: 'scroll', whiteSpace: 'nowrap'}} title={token.features}>{token.ufeats || token.features}</td>
            <td>{token.parent}</td>
            <td>{token.deprel}</td>
          </tr>)),
        ])}
      </tbody>
    </table>
  </div>
)

const NlpView = () => {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [view, setView] = useState('ner');
  const [steps, setSteps] = useState(['tokenizer', 'ner', 'morpho', 'parser']);


  const process = useCallback(() => {
    setResult(null);
    setLoading(true);
    run_nlp((err, result) => {
      setResult(result);
      setLoading(false);
    }, {text}, steps);
  }, [setResult, setLoading, text, steps]);

  return (
    <div className="demo-container">
      <div style={{marginBottom: 10}}>
        <Select
            placeholder={'Select a sample text'}
            style={{width: "100%"}}
            onChange={v => setText(sampleTexts[v][1])}
        >
          {sampleTexts.map((e,i) => <Select.Option key={i}>{e[0]}</Select.Option> )}
        </Select>
      </div>

      <Input.TextArea value={text} onChange={e => setText(e.target.value)} rows={10} style={{marginBottom: 10}}/>

      <Button type="primary" onClick={process}>Go</Button>

      &nbsp;

      <Select
        mode="multiple"
        placeholder="Select tools"
        style={{minWidth: 120}}
        value={steps}
        onChange={setSteps}
      >
        <Select.Option key='tokenizer'>tokenizer</Select.Option>
        <Select.Option key='morpho'>morpho</Select.Option>
        <Select.Option key='parser'>parser</Select.Option>
        <Select.Option key='ner'>ner</Select.Option>
        <Select.Option key='frames'>frames</Select.Option>
        <Select.Option key='amr'>amr</Select.Option>
      </Select>

      &nbsp;&nbsp;&nbsp;

      <Radio.Group onChange={e => setView(e.target.value)} value={view}>
        <Radio value='ner'>Visual</Radio>
        <Radio value='conll'>CoNLL</Radio>
        <Radio value='json'>JSON</Radio>
      </Radio.Group>

      <br />
      <br />

      {loading ?
        <Spin/>
        : (
          <>
            {
              result && view === 'conll' && result.sentences ? (
                <Conll data={result}/>
              ) : null
            }

            {
              result && view === 'json' ? (
                <Card style={{maxHeight: 400, overflow: 'scroll'}}>
                  <pre>{JSON.stringify(result, null, 2)}</pre>
                </Card>
              ) : null
            }

            {
              result && view === 'ner' && result.sentences ? (
                <Card><NerComponent data={result}/></Card>
              ) : null
            }
          </>
        )
      }
    </div>
  )
}

export default NlpView;
