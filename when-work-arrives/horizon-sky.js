(() => {
  'use strict';

  const copy = {
    ko: {
      title: '한 나라의 모델 공급이 멈춰도, 사람과 에이전트는 다시 연결됩니다.',
      empty: '지금은 공유할 모델이 없습니다. 한 나라가 모델을 나누면 다른 나라들도 다시 일을 이을 수 있습니다.',
      homeCut: '서울의 요청은 멈췄습니다. 다른 나라들은 남은 모델을 나누며 일을 잇습니다.',
      scene: '서울에서 시작한 요청이 나라 사이의 공유 협약을 따라 이동하는 모의 지도입니다.',
      previous: '이전 나라 보기', next: '다음 나라 보기', pause: '지구의 움직임 멈추기', play: '지구 다시 움직이기'
    },
    en: {
      title: 'When one country stops supplying models, people and agents can reconnect.',
      empty: 'No shared model is available. A new offer could reconnect the participating countries.',
      homeCut: 'The request from Seoul is on hold. Other countries can still share the available models.',
      scene: 'A simulated map of how a request from Seoul travels through agreements between countries.',
      previous: 'View the previous country', next: 'View the next country', pause: 'Pause the moving Earth', play: 'Set the Earth in motion'
    },
    es: {
      title: 'Cuando un país deja de ofrecer modelos, las personas y los agentes pueden volver a conectarse.',
      empty: 'Ahora no hay ningún modelo compartido. Una nueva oferta permitiría reconectar a los países participantes.',
      homeCut: 'El encargo de Seúl está en espera. Los demás países aún pueden compartir los modelos disponibles.',
      scene: 'Mapa simulado de una petición que viaja desde Seúl por los acuerdos entre países.',
      previous: 'Ver el país anterior', next: 'Ver el país siguiente', pause: 'Pausar el movimiento de la Tierra', play: 'Reanudar el movimiento de la Tierra'
    }
  };

  const radians = Math.PI / 180, tau = 2 * Math.PI;
  function globePoint(lon, lat) {
    const longitude = lon * radians, latitude = lat * radians, cos = Math.cos(latitude);
    return [cos * Math.cos(longitude), Math.sin(latitude), cos * Math.sin(longitude)];
  }
  const countryPlaces=window.Federation.countryAnchors(window.FederationAtlas.hubs).map(place=>({
    ...place,point:globePoint(place.lon,place.lat)
  }));
  // A geographic territory without a named hub can still be inspected on the map.
  const hasHub=new Set(countryPlaces.map(place=>place.region));
  const mappedRegions=new Set(window.GlobePicking.regions.map(region=>region.code));
  const territories=window.GlobePicking.regions.filter(r=>!hasHub.has(r.code)).map(r=>{
    const name=language=>window.GlobePicking.regionName(r.code,language);
    return {id:'region-'+r.code,region:r.code,kind:'territory',lon:r.lon,lat:r.lat,
      ko:name('ko'),en:name('en'),es:name('es'),point:globePoint(r.lon,r.lat)};
  });
  const mapPlaces=[...countryPlaces,...territories];
  const byId=Object.fromEntries(mapPlaces.map(place=>[place.id,place]));
  const byCountry=Object.fromEntries(mapPlaces.map(place=>[place.region,place]));
  function countryName(place,language) {
    if(place.region==='AU' && language==='ko')return '호주';
    return window.GlobePicking.regionName(place.region,language);
  }
  function resolvePlace(value) {
    if(byCountry[value] || byId[value])return byCountry[value] || byId[value];
    const region=window.FederationAtlas.hubs.find(hub=>hub.id===value)?.region;
    return byCountry[region];
  }
  const mapCopy={
    ko:{
      hint:'지구를 돌려 나라를 누르면 그 나라의 연결이 보입니다. 방향키와 Enter로도 살펴볼 수 있습니다.',
      live:'협약 참여국 연결', peer:'파운더리 간 공유', cut:'중단된 공급', suspended:'공급이 중단된 나라', source:'파운더리를 공유하는 나라', access:'협약으로 모델을 이용하는 나라', offline:'연대 참여 · 이용할 공유 모델을 기다리는 중', outside:'현재 연대에 참여하지 않은 곳',
    },
    en:{
      hint:'Turn the globe and select a country to see its connections. You can also use the arrow keys and Enter.',
      live:'Access by agreement', peer:'Foundries sharing models', cut:'Interrupted supply', suspended:'Supply suspended', source:'Offers a shared foundry', access:'Accesses models by agreement', offline:'Participating · waiting for a shared model', outside:'Outside the current coalition',
    },
    es:{
      hint:'Gira el globo y elige un país para ver sus conexiones. También puedes usar las flechas e Intro.',
      live:'Acceso por acuerdo', peer:'Modelos entre centros', cut:'Suministro interrumpido', suspended:'Suministro suspendido', source:'Comparte su infraestructura de modelos', access:'Accede a modelos por acuerdo', offline:'Participante · a la espera de un modelo compartido', outside:'Fuera de la alianza actual',
    }
  };
  let globeCount=0;
  const stops=['KR','MN','IN','KE','SN','BR','US','FJ','AU'].map(code=>byCountry[code]);
  function interpolate(a,b,steps,lift) {
    const distance = Math.acos(Math.max(-1,Math.min(1,a[0]*b[0]+a[1]*b[1]+a[2]*b[2])));
    const s = Math.sin(distance), path = [];
    if(distance<1e-7)return Float32Array.from([...a,...b]);
    if(Math.PI-distance<1e-7){
      const pole=Math.abs(a[1])>.9?[1,0,0]:[0,1,0];
      const tangent=[a[1]*pole[2]-a[2]*pole[1],a[2]*pole[0]-a[0]*pole[2],a[0]*pole[1]-a[1]*pole[0]];
      const length=Math.hypot(...tangent);
      for(let i=0;i<=steps;i++){
        const u=i/steps,angle=Math.PI*u,height=1+lift*Math.sin(angle);
        for(let k=0;k<3;k++)path.push(height*(Math.cos(angle)*a[k]+Math.sin(angle)*tangent[k]/length));
      }
      return new Float32Array(path);
    }
    for (let i=0;i<=steps;i++) {
      const u=i/steps, height=1+lift*Math.sin(Math.PI*u);
      const x=height*Math.sin((1-u)*distance)/s, y=height*Math.sin(u*distance)/s;
      path.push(x*a[0]+y*b[0], x*a[1]+y*b[1], x*a[2]+y*b[2]);
    }
    return new Float32Array(path);
  }
  function route(from,to,lift,steps=48) {
    return {from,to,path:interpolate(byId[from].point,byId[to].point,steps,lift)};
  }
  const home=byCountry.KR;

  // Quantized WGS84 paths from Natural Earth 1:10m cultural vectors via the QGIS world map.
  // Shorelines are dissolved country polygons. Coordinates are delta-coded in tenths of a degree.
  const coastlines = [
    "bdBzr@f@Ck@BB?",
    "lcB|q@E@fACaA@",
    "reBlp@c@EcAP`@B~@IDE",
    "xkAhm@KCRA}@Bf@FLE",
    "tmA`m@i@FZ@l@O[AQFL?",
    "vw@rl@LBCEFEQ??F",
    "b}@fl@x@Ek@EFBe@@JCMAI@FDOECDSGE@PDYCLDS?nA@",
    "`x@FBIKTJAGEBC",
    "l`BoKCCQLPJBU",
    "bz@eI^J^ErAg@ZE^SLUICDCEMJUp@q@E@TIEEJBEMZS?KJ?TUPk@d@OIf@a@^Sb@?ECBQl@QDERHBDKb@Y@WPSHDZSS?DCEK`@Y^aAVQh@K?IXWAILMAEGDFIS?^?Zm@EWHYIQAq@O?PAEGDCEAF@H]e@DCBJHKI?JHBG?IQHGCGLEEETAICFA@GAFNCEILBEKDHHAACBDJAME?E?DJ@DGHDNGMAL?EEQANCDF@GMGGD?GH?AIHJF?AEHDGKF@JOUFPGCGLJNIKERCACGDFGI@DCKCF?IIDADJAQ?JLHDCIEJBICFOVHCKI?h@SKCJEKBJGI?RCEGFDJCHU?FDAIRNCBGEAXCULLB~@YGICFGCJENFVCACv@@C?PEEGXBECT?KALCIATBBEDFCIRHIBH@O?HHRA@FBE?DXHRASIP@ISSE[@TEMEhAVIB`@RSBPNl@N?Dd@JB@I@DBx@JDCFHJC?DJA@D?E]O_@@FCGGw@UBKIAHCOOZJDGI@HEDN^MZHF?ICBCEAHCGCNOKGNFCDTBb@OIEK@@BSC`@AECJAMGNHJMIA@CKGI@DCGAFAIGY@OGWAECBIHAMERARHDG@Dz@CNKS?h@IkAQM?JFI@u@APAJMQH[?X?FCGEPCX@HIr@OI?AIs@Ca@WB@k@GD@GD?EI?NAk@E[IQBJDC@QGQFe@ABBG@H?[B_DDaDZPCIAHCK@FCYA?EM@HFcAQ]?pAXK@HAQ?FEc@ICHIK]EDBE@[ILCCCs@XECH@IADCK?HAMCJ?OC@HI?FDS?GG_@?sAPk@?UH^HG@_A@c@Ei@LADLC[PJICEIDPQECBC]AOG~@DIEi@Ea@PUCWHkAABE]FJEFBJKOA]BFDQEJNQ@BBIBVAMHDEQAHMCGi@IF??INDKGDAOCp@EJGOENEAIS?ACHA[GADKAOF?H]LP?B@M@RDs@BT@SH@JG?QSWHCHJ??DQPSEOYWERE@KaADR@g@FNBODZB]PDHd@JJCAEX?K?QL|@EQD\\Pl@Kb@?{ANVRf@?EBHAEBBBfAKCD]BFBa@@CDd@DKBL?BBEBNCIBNBED\\VATDDODBJCKS@OXHHm@EmBd@DDEEw@B?h@OLF@]LJHQEOJFIGIIHAEDEKGJOBMEAFEEANIg@KYSD[b@Q?GQG@EI@BAEGHEEAFAECL?MMHCBKMEy@HQGa@ND@M?DBEBa@FGEADFDCFZ?[BBJI?BFN@]AKFBFRDSCGK@HGG?JYSIDBDAKMAFCEABCK@HGI?BACGI?DDGAEJG?F@M@JDQABBIBNFSCLHOCBDODJ@UFHDCBPCQBF@IBH?O@BBQB@BGCBFE?HFQEBBK?HFMIBBGCAF]Bj@HWA`@LNEQDFBs@OJ?GAOBBJQGB@SFHDGFL?QBJ?KBDDTH^@XRbC?PRR@XTZE[D\\X~@VGBLFWGEKSIa@Ia@[_AQSBGJTH\\?WFOCJLK?CPe@JOEQJt@JADLCADXNJCEQFBa@QEDOG\\@KIHECFVHZ??JXFDGFJJB?EPRAHFDMJCGCFXBBE@FZ@PH@IHd@JHJMKGJFIRDJH@AIHAEAFCKONDEXRGCIBJUFDBJIOJBFDEIFRCYFITHQCJFCFD@E?FS@HHPCKBFDK@T@HP@ENFJNXHABDCCDNNC\\Y|@F^L?CATWCCBB?IDBFMEEHAAYVQXFDKPAEAb@DCABG@Fh@ABDS@FFOFFDAEHEFA?HBEHDPMHD\\C@E?DPDECJAEDFFRHCALAEDTHAJFCM\\NbAIXFOe@bAM?MJi@KQDS]CUk@KYBP`@E@FZBMFHE?@ZLTmAAe@RDBCHLz@a@l@UB]OK?UHUV@KYSAUMII@@DCKQ?_@WKFPHGPHPINKMJUc@MFACKGLWDELc@AWJ[IJCq@?TBEFF?g@JBPH?]?SHMNBPEIG@OL?JCIUD?E_@@EBBFEGQDSL?FCEAJE@@IEBGh@OF@HC?ZXJVNDI@[O?TOCCDGEBPKU?BEGEDESOA_@HCFCC?FGEGJDDG?FRIOEABHOKk@LWCw@h@_@BGHG^@T\\j@PHN^FFBGB@BbBJJ@XVd@?HRH?HR?@EHFNCRPR@b@^HAEBFDEXBXTPP^ZV]a@LI?NPPAHHP\\^h@B`@GHMC[Fd@[RBLMD?JPVLFv@HXCGJDA?^\\DXGAXKDKECLXAKDRLBVZFLNOPUB@HJBK?b@TDRF@FGABF@M@TRCACJJ?K?KLNA`@H@T\\GKCADMKDCVFG@F@CBPEK@DI[CXADJFEMENB?MODAGEDFBG??KLEKBLAGDDBBGAHBIFA?CEB@IJCI@CKFFDEEALCO@HEI@FECEGDFGEGFHDIKKLGSBEAFCI@HIBDNAMAHCIA@IPAAENFE@DC[QEDH@KA@HEAIOF@AEMAJA?EOILGIEDIGC@KE@DEG@@GFAKIVFFMMa@Hi@IASi@Oo@@kAQs@?}@Ic@B{@VUvAu@HMCIZi@Z}@R]TKCGFS_@i@@KHLLIECBQKGC]YIBEGC?KOCOYFAAs@T]EEGDFIDBJM\\PILFDH?BMDBNKLDb@g@JEGHBBJEBSCAf@e@G?@IX@C@v@O`Am@",
    "~lAw]NBDGL?IEb@G?GIAL@DEy@Hk@d@d@GGG",
    "lqA}_@LGOCCDFAGBF?SLPI",
    "xgBg`@SIDEO@\\L",
    "brAq`@@IQBDFOKHRNI",
    "xeBia@QCIF`@DEI",
    "zqAka@JEEEH?EEHISHGHHAMBBDEBLC",
    "bqAua@F?CGMDDFBE",
    "drAkb@HBFMQ@AFFCEB",
    "lsAmb@JKECKDARFI",
    "t~Ayb@RJGGN?G?BBHGKGKFDIM@@EWFRD",
    "fsAgc@@GMBENLFEGHK",
    "ftAic@]@R?UHREEDD@JM",
    "rgBsd@WCMFLBVG",
    "hiBof@`@G]A_@FRFFE",
    "loBgh@?{@G?[LG?LEq@LDDQA@DK@AJD?IFOAJCEGJAS?I@BB_@Cg@PPHPCIDd@COBJDK@TDSFPBDGBDTKL@JMp@?HIIGVB@FIDJF?Q",
    "b|@}i@b@EWE@EIBFCIEu@RXHXE",
    "zcAol@HCi@FGPG@IEHCFWm@B]\\BHgAPAFr@@IBBFQGIDVFh@ACC\\ABEn@NrABHECGp@AZMuBEp@GfA@NGaAI|@@IEZASGHCGCgAOKDJH_@Gc@DJHUGQBFG",
    "jnBuk@ODp@B?Ka@@",
    "l{@}k@RDJEAHR@fA]QE]F?EG@JEO?b@EW@LECAiA?CBL@I@XFg@BCFJ@GBF@G?B@",
    "piAgl@R@DNj@Fp@QE?P?i@c@RI_AEo@Jc@Ci@LnAT",
    "vx@ml@d@AODJHT?GCPK?QU?LC_@EeADj@V",
    "haAwl@PE_@EQDLJPE",
    "tz@wm@TEa@IWBEHh@@",
    "ddAwm@p@FVEeAIz@@KENAHBCBX@f@Eu@Gj@@o@Ed@?g@EVASCq@DULo@?VGOCTE_@IEB@DI@FDO?DBUBKIQFJJ|AD",
    "lhAqn@LHV?e@I",
    "h|@an@IBt@@BCI?NCe@EnA@g@CLAEAJAICJAi@HIANAOA^Eq@COBAJDBKDN@",
    "n_Aon@XAg@ALB",
    "f`Awn@DCa@@Z@",
    "fjAon@r@AkAWw@ESDRBMBL?IBRFVACGRDEBHBFEDDCBNA",
    "l`Ako@EBN?PI[D",
    "tz@so@o@@~@@OC",
    "xcAqo@f@FVIiAEXBOB",
    "f|@_p@FGgAFJBI@B@b@BPCQATE",
    "hcAap@nABs@I[D",
    "b_Amp@s@FI@DDQBRDVGbAAHCa@C`@AECPCe@CUD",
    "pz@cq@ZAy@C`@Em@EVCUA_BXG?HEQ?ABH@UBHFc@AODh@BJHFCEEH@BDI@P?EBDBVGIFp@?RE[At@GmAC~AAJC]E^@PGu@A^?G?",
    "j}@cq@UF\\AGE",
    "bg@lq@r@GcB@KAJCKADA[CF?WHZNdAE",
    "nh@`q@ZKe@@N@WDP@",
    "zk@tp@WKoAIz@Vj@A",
    "dn@tl@IANA_@@JDGBB@\\GKA",
    "rm@fk@UAz@D]GGB",
    "bk@fl@ICf@?[E^E^DG@HBZGWGg@?PEE?{@@?E\\Ca@Ej@GCIJGc@Ei@f@@Zh@Ht@Es@?",
    "hn@xj@EESBX@",
    "ji@|h@NJJA]S@H",
    "vf@fg@OB\\@ME",
    "`j@na@H?EBD@JG_@CL@QDH?MFPC?E",
    "zi@f`@i@X[@ZHlBIe@ANGUH@EG?AFGCTG@EQETAEIDA_@EKJF@",
    "tl@v`@HGK@FCGAQFRB",
    "`e@p_@MEFAI?HE[?VNHA",
    "|m@x]ECDEKA?VF?EKHHFIG?",
    "dm@bYIHFBEJDDJCI[",
    "le@sEKC@LP?GI",
    "xn@eJLBVK]AMHD?",
    "~h@gJ?I_@@DFX?",
    "xk@mKa@BCFK?FBYHFFf@CLNLKb@BJGi@AFKAELGa@A",
    "~m@oKp@BIOPALQVAHIX?FCIABCP?VNP?KAAKSGs@C_A^BEMJWB?F_@FTD",
    "vl@mXN@i@IXF",
    "he@{[QO?LLJG?GKIF\\FDIEC",
    "hf@w[@EJ@NIGGAJe@?PH",
    "te@{]CDR?b@Os@H",
    "lq@}_@ZESCGH",
    "tp@_f@CDDFJA?EME",
    "hs@cf@GE[?VLJ@?I",
    "rr@{f@CALAACH@@D`@LFM\\@SGBICOMIKLEEw@RCFF@SAODND^E",
    "ho@ei@KOa@BFL^BDE",
    "jl@ki@PIEAL?AEVACEb@F?ESCREGCR@GAHAEAJB@IXIJDM@AFz@COFf@KYFpAALCAE\\DRELKs@@x@EBK[]gAGE@d@RIDBF_@Lf@Dc@CCDCO\\EKEYDLEIATABGa@@\\Ee@@^CiAIYRVHQEHJOGIBHCGC?DOABDM@DEUFVGe@@^ESGo@DEB\\Fk@CVJOCJBI@DBIIQALFMCCBHDQCFDQM[F`@HK?FBg@IZLOADHIKUEJFSEUBh@Ne@EZHk@MMJx@B_ABj@AD@W@PBKCMBN@M@^Au@HV@_@BFBE@IG@JCGE?AF?EMAHFMCKHPAO@LDYCFBKEJHQC?FOIOH^DQDTAODJACDNE?RNCAEFDDCICN?ICJ@IALAUK\\FGGHDTIJ?KDPCOJ^EO@D@IBBDMACBD?MB?F?CIDIA?DK@J@SDDBI@?FNIMPLAGFD?ZO?FXOCFXG{@^@DhBWLEQC\\ELGAGNFAGF@BEF@IBBBTCABRB^ISI@E_@DGHBCGCLCo@CRKk@UDK",
    "bo@{l@QHdA@XOmAB",
    "nr@sm@TE?DN@rA??GPD^ACCLDRKIG@ERGl@@KAj@GWGs@DFFu@CG@T?o@Dn@A[BPDUCOBJBQBCEm@DB?s@Gy@?]DNHU@|@D",
    "hw@go@TG_@DH@",
    "`g@cr@fB@u@BfADsBEhBTTCKFj@?e@@RBK?B@|@AJ?a@DbBBiADxA?W@HBo@CLBe@Bh@@a@Bd@@Y@D@l@?IFRD~@GMFR?E@q@?G@FBa@@bALEEd@GKFXGCFTENBMBN?ZEE@h@@@G@FTCWIe@ATCHIiAJS?DC]Kp@JGCRAUAZ?a@ER?GGPHN?GE^DGAFCKEe@Cu@DRCc@C`A?[A|@MWAVA?Eu@?_ALOA`@?ACb@GeBEd@?eAEn@?k@Iv@BG@b@Ft@?EAb@D^AuAKhBJb@E_BGdBDJC_AE~ACmAGeABl@Ek@EB@qBJdAKi@APE{@@d@CC?_BDf@GE?yADTCsC?l@DmAEB?g@DHBm@@z@H",
    "l^dp@WK_AEi@H@D\\Ba@?MPPDGB|BJzAASKS@i@MFCGK",
    "fUlp@a@Bz@AYA",
    "moBft@?|Az_F??mB}MNP?[Ah@Cg@AvEGcA?j@E]AXC|@?GAbCQ}AHyAAQDcCAMC`@AyBKl@KSC`AG}DGbAIS?NCM?DAw@?ZCe@?zDWu@IxACDCICBIuBBo@Hk@EVCCCaAFHEO?VCU@JEG?rAG]Ew@DTEoAMe@FLEa@GaA@LC_@G]DqFAkAICBy@?BGQCOBHBABKAVDK?FFu@EFCKAJCEA]D\\LC?cG?h@EMG^?BIVABEqA?nAEHIGASFyEBe@C@IU@HFEBu@AgALQC?ISBDGa@D?Di@AFFeDOYEMMNMCGZ_@[@KGLEIABCEADAKALCOIT?AGIC?FI??KO??Ke@IDCCGOB@COA@EQ@KKiAQIFJC`@NEDVAj@PIBLDGD]AHD`@AAHVICBHBEDNAHFG@P@EDFBG@HBSALBI@BBWBDC[CPBKBLB]H@FKDHBSBLBWFVFYB^@a@@FBIBP?ABO@BFQC@FL@ZEGFQ@BFP?OBP?Y@DBZAKFLBNECBR@U@ZBW@jCTI?DBxCCk@Rw@@ZHdCGP@wANz@BdAOQHRAcAVAEuA@HH|@@cA@[LL@{@@c@GOF{CJpADM@FDQ@}ACn@DQHD?W?PFo@@oBYF?aDEEBNDW@eC_@_@Bc@IaGMbDEWE|ACj@IUOO@DCICkBUsEQJEYOo@?OIh@?MALEQGa@?HG{@EKK^G_@BOIDCe@NOADOe@AG@HJcBAKH{@QgBGBEQDQGs@LUKJAKAODw@C@F_@?OEGBFDMB_@AIKQDNBI@S?OGQHm@@kBSEIHKMCU?LF]BAFs@?UHEIKAAOeBU[?AGQ@H@MBB@UA@DCIOERCOCMDBBWAFAEEJAAEcAKgANX?MDRFI@[Ge@JSCuDFKLPDK@J@GDR@MBH@ABNCRJg@@DJ^TDNLBQBOC@GGCY?e@QDAEI[KDCKEk@?IA@Eg@GQGBCCCaBMBCSEwCKa@BkBCDFq@S[?{BTc@EBGGCm@EWF@D]Dh@L_AKeA@`@DE@cBOMBWIS@DDIFg@@KOSE}@?KFUGWFOCkCLJPi@EQDDDICFDG@mA??FK@k@AAIa@NsAFIDFBQ@KNQBDMKAYHEEeADJB}@LAGMHVFIFf@C_@DLJx@GIHU?b@@D@I@JBH?BIGAP?OLPASLd@ETHGBBBf@B_@?BBQBNFOBHBKBLBQ?KFFDO@H@Q?NDa@CCF]DzABRGIJTCJDKDZ?W@XBg@@`AHs@?C@V@]Bb@@[?FBK@R?kAR|@DmACsANd@@SBcFNI@?P",
    "zK~l@CP^G[I",
    "pc@`g@ME@DO@NBJE",
    "dV|`@PEY@QLXI",
    "tc@n_@J?EBD@FCME?KOH?EG@VDEB",
    "n]ZRFHEDD@]m@?FT",
    "jD_BlAs@ECRK@EGCDBCGLKAEPGBQDD?GBB@GB@IEHCICRDEELAEEL?[GZBAQEDUEV@?KB?ECFFLSSSIk@H[EOLSBDCSSe@SQG]QIKW]GYSIO@YIWq@[Qc@IAULYCADQ?{@[w@G]DWIg@BWGK@AHMCJLMRVREHg@Py@FKRg@HWJSIA[_@O[FCFa@BCHkALi@OO@EBF?EBS@[I]{@Bc@GIPDJELJVBh@QDLL@VOTBQER?EEJGCERECGEFIAHEGCHGEEN@AI_@IW@BCUAJA@Gg@@i@Qa@A[Ne@Fc@?a@QFQ~Aq@UACMMAPKQ?BAQIbAJPJCGFDINY@t@PHCCITEWI@Cb@CEAJCU?J?DMCLHC\\TDA?RJ@@ED\\H@JPMRQD@B\\?XPKKn@CLBMHT?GDNMD@MXFCCFJ@]JAHTAIFN?ITHGBFDKHBJUMGUFEEh@AFIICH?Z[E[t@_@PAPMGALOHCFHFMEALCPHED@NWJU\\[B@Fq@ZBDHIPAFJMNJBHPHAKQJWxAm@R_@XGr@ZVKb@F?Zp@RRXINLFBLPBHLl@?VLXYh@DA]E@LEIGLDQg@DYECD?CGDBBMSA@EKCMDeBBQ[@QKJLMC?@KRI@II@t@KDCIEHE_@EGFYAHUK?CF]CD?_@M?Ms@GPCQ?FEOWQE_@@@GQAIDCIUFVOGCHKAEHA?IE@DCAKUB@IMA`@FGGg@KDLFAGFH@WBZLE@HJG@F@I?@DY@DDKB_@I_@NFE}@OSAMHe@SFDM@B_@MUQCUNMECSP?BGGAH?AGg@Io@DCGi@A^IAErBPGCFACE`@C?QE?JUKGBCOAk@]QCLQf@?H@CDJCGBPBEBJDKFPJXDVLHCGFN@GDBJF?APM@WNTFK@LFBEDFVBM@H?GB?FD?CBDCEFNZVAHNZ?EEJKGCVWCKL?@ME?LC?MBFDCAJN?ZR\\?CCVE?GSAL?KIRDDCe@SP?HH?GJ?KEH@DCKAHA_@CID@CMAFAECDDJC\\DBCKAL?QANCc@C^?CADCY@HAK@@EEAIFCAVGe@AV?EEYDJEOBHE]IADUCBAOG\\HBCEAJ?u@UR?a@GL@KEFAG?@EI?HC[CT@IAHCMAHAOAHAk@EZ?_@GTCUAJAMEIHDCIAJCc@AZAWCHAK@FCOKYDJGQCDFOKFLSCFEOCODDEEAPAEAc@FCIWCHCGCY@NFAF[ODDG?@BSGFCSAE@NFKAHBI?DFOOm@Hp@BUBBDOCSDOGSDRAGDD@Y?HFMEm@@cB\\GJBDr@LdCU{@XJHMLD@u@NKI^KKE[FFBq@@NSq@SU@GBDBGCGDESLGKOTK_AJCDX@HD]LWCCMY?HEgAMCDECFAc@GI?R@G@D@CDL@_@@KGe@?_@GIBDFK@AGWCPMOE_ADQDBBm@BWLQOL?FIXAAGGA?MLEa@KUYk@@WBAFTNSJFJCZSFHD?Hb@LEDr@A}@Js@]FMEGg@CMHBLg@B^C?EMCJKjAEDIOSXMg@MDMSDFT_@Dk@@L@@Gf@EDEi@?LCUE_AL_@?RFAHDBCF@GMGCBHJI@@COCLKIIx@QAIJCG?DACEcCEXFSHRGe@Ib@I[?NAEAT?Y?OGNCoCMZAWAD?w@Bm@GSDBBEETGcA@XCECDA_AOk@Dj@DcABTF{AEy@PDFXE[FjDr@sBQZAICo@DIA@CKFDBGDDFQ@PCOIHCcBAI@JDYB{@BFASAGCHCCESAcBNXBU@X?[BCFb@Ec@LL?OJ[FWIDAOKg@JQEk@HKCJAECe@@LGQET?g@GFEyBJt@?E@q@APFECLACDNACBD@m@Ko@BIBXBe@BLD_@AIDF?OBcAEaADQHFBADUBAHG@JHOGBGECm@Ey@DQEIJm@HKERKGC@EoBBkAPFAG@?lAXH`@IJ?SDx@@}@A?FM?GFCFH?UFCJHDh@KEDzAVE@p@NBJTMj@BNJCMZFC@FBDEP@FFAHF?C@TPGFEEKDHF?HG@CHN?IEL@JNEPf@HDLEF`@@@R^TTwAEYUODE_@EgAo@e@IDAIEBAEQ_@Cl@AFNE@P?j@TCGJ@?EIM`ABv@b@@FQ?CDjAFDEWAx@KLDCDpBCl@Rt@f@z@\\_@D?NQIFBK@JHYIBHCOW?_@RBDHAKBBHIBPPHv@dBbBd@NZKJLHA?FPH@Rj@T@HSHS^CTJRX?FJ@GLHBIG?FEIODAGANMQCDC?KTCDDCCH?ECJ?GKI@HCEON?BI~@ZMMLAUSFIL@l@b@V??LYDAPM?QKg@FBH`@DBHHACBTRULI^URb@CHIGFO?WTd@LYAMFLFIAADJ@CHHAIHRBEBFLDA@LHCEFFFFAK@?JFCLTN?EB^PEBDDr@FFIEAF?APDGCFHDHC@FFCDFVD?C@TF@BMCKDEHFJI?Db@JADNNFRON@Du@p@Ir@D@BV`@RJEAFF?CDDEGHJGGJLGGJXNA]TKDB@MFD?ONMZEAORB?TNb@?TM?Ih@WF]ZEJ?b@O`@BEHDj@]ViAZe@FBGk@BF?MGSFCAYFQ@JD[@a@D@HSBPHCAFPL?GJDCIFFAKHHG]He@BHFGIADIJC?D?ODFLSBWFIJDDSD@EDBFCFFJBMFN?KBJFGAHF??K@J@GBFFOEDXNAJJLTBBDIC~@r@@Hf@PD\\ENBCCFJd@CRJ?FNKDT@PRROh@oBP_@Js@CED@?GC@FMEQDKIGJ@?EGEN?@V\\D^]YEEINFNEHIGGHD@EL?DQH?DOzAJXGt@CHCHYf@JTCl@WXm@JBHI@HRAEJH@G@M`@[PBLOXCYK@D^KDk@Ai@g@Mf@e@JSXXb@DCDD@XRDFNR@FNp@JDNr@PPL~AZFADIJg@CYHQNON_@\\Y@YJ[TKBOf@y@J?G[Nb@RQJ[DFEJ_AdBD?CPWPGRBAEl@WNUz@CGEHSFi@h@AHPHMA[VWIKBSIu@EMIIBDZG?H@@Px@`Bd@f@p@b@h@p@HB?DLFRf@FZOPBd@ETSLFJCx@EDBR\\\\l@PFPXPJAQx@CE@d@z@d@I@Jn@RNZf@h@`@j@R|@?r@NVMFBJ]IC@Q`@}@VYN}@?a@v@cB?_@Oq@Ya@?SN_@GOTk@QCN@DSn@s@IBJCJWKFPSEDEYMBLEE?CKHAIM?k@J@RSAHVEBFBGCFBC?DN?HQCEHCCCd@IGCn@FdA\\`@M\\BE@n@LVG",
    "o]aYMRQHP?@PHBCZw@Ti@C?i@FIFBAIGBDACGL?ABDMCKOHUGTUL@@PHSEKZIHSJCAEYBJGGIe@@JCG[d@Cd@HJNX?CBPVIBCLEGBPYX",
    "s@{WQ@FFLECC",
    "n`@c\\?KJFGKDI^RD?YO\\BKCD?AERHn@ABEUKR?KAEII@DGIABCOYa@KLBGDV^OM@DMAJJSADHQI?BS?LHK@JDWCPFE@DBEFMMFJICCDHNH@",
    "`Cu_@j@L\\?KEL@IGJ?_@IT@SKXCKIHE_@?GIL?IIO@AEIBF@WAGFBBI@RHGRHL",
    "Dq`@KHDDa@@@LVJS@?DTFjA?@HJE\\F]UW?KKPFd@EYQBEL@KG]CFCEKD@HGKIh@BIMDGG?DEBDDAGEHDFLCSKGV?OGFMM?DEIA@Gg@?ZLK?JDs@@LPNBMBV@k@HGRM@KPNAG?",
    "dM{f@SGECL@KGLBBE`@Am@ANCQEv@?WCJCM@JCECUDJEKANACAa@HHBMJCGI@CKMF?GMAMJBKODUC@GUFOEJDQDDDS?FDI@L@I@N@C@JFJAt@Pf@?NG`@@",
    "p`@mj@XCOCJE]?]Jp@BSCF@",
    "hPek@g@GGFv@BGC",
    "t^og@ZJ?IQERBCIJ?i@Gf@DBGJ?_@Eb@@eASdAPGCHCWAT?YCb@EiAAfAAYIq@DVCSATAGAv@FQGD?U?VC}@DVEKEr@Bq@ECCJ@CGOBFCKAR?QEL?MIh@Al@KqABJ@BCM?NAO?ZEU?JAE?R?KERBWE^@[E`@?KELBFICAF@KHL@ADd@E]IPDDAQGRA[?L?IEF?ACPAKEREI?NGECVBUIp@MIABEp@ItC@VE_@EbAEcBAt@C{@C|@?TAOCfAGKAF?ECgCKSGBIWChAAu@MWCOFJGq@?FCIAHEq@Am@Jz@MeBGODBHE@II}@FE?\\Ea@?`@K_CLI?LCIAFACAm@@dAKwBFHEbCEeA@f@Eu@AqAJHEk@Cf@CeDCcBDfEFoEEGBTB{ABlEFa@@x@DcDCh@HE@{@ECEi@@BFr@PsAUM@HBsAGmADnAPjB?cBBvADBDW@FHM?h@FRTUEc@Db@Bo@BCBBFrA?Q@L@ODg@@l@@u@DDJt@KQBT?g@Fd@Aa@@AFH?i@BJDp@GEBL@G?FBMF?G]BBHb@@`@Gc@@d@CFDVISH\\DTEQDX@s@?l@DQBWCMBXBcAHJDWAJ@?DMCAFJ?K?D@G?DBGDP@@I@HL?XSnAMYFV@}@BZHTCE@N?I@XHy@?j@F_AG_ADb@DEBt@P|@HHCF@CB\\?PIILVB\\ZTACD\\?@DLAMGLAB?G@DFHAEFTAPBG@@DV?MLV@SBB@EDRCMFT?IFN?GDZ?SFNAMBBDG?NBIBL?MBN@KBR?Q?NDO@\\@UHREHFJAMILHKKXBKGPBSIPDGGVHX?ICL?K?FCEATAOATAM?HAEEJBGGJBEERCKKLDECHAIARAOAP?MET?MCLA]A`@A_@EJAWDZQEF",
    "`Ngl@FGs@FP?KDd@E",
    "fNyl@]@v@?q@?b@AK?",
    "rKkm@b@?OESD",
    "hJcn@MF\\??EOA",
    "vJ_q@]?PDVAKC",
    "f\\sr@o@BJDt@IQ?",
    "oN{TVC?Gk@HICBDX?",
    "}GcV^KBG_AEJN?NNE",
    "sMeWJCIAQDGLVM",
    "gDoWBc@YAEJBZJCFFBE",
    "{D_YJ?BOOK?Z",
    "qEua@CFRGO?",
    "qFya@BEM?LZ@IHAFIKCBAOD",
    "kJsb@@IQG@HLF",
    "uLmc@MEM@XJCCDC",
    "_Iwi@R@KMGDDBQEJF",
    "wIgj@DCKCKBXDGA",
    "{Lmo@X?OGNCi@C[HVHRC",
    "qJso@ZLAFP@NESAr@Im@@\\Em@Cz@BFGiAERAIABAVB?GRBED`@BJEO?d@IW@NCGCPBHG}@GXD]D@CKEg@PPQMEc@FFDKCKFs@Fp@DAFL@AB",
    "uLcp@GDh@Ca@A",
    "aNop@xAGu@CdA@LCOCT?i@ABEs@HIIK@DDWEy@DZL`@B",
    "c[|NRINu@Ym@Jq@IYa@IGDBGKGADCACM?FGICBDGEA@MGBIG@SKIKTKn@DJDKD@CXFH?Pl@dCh@J",
    "eS}Tm@K^TLI",
    "c]ej@QGWD\\HJG",
    "qc@{j@IE]LP@TI",
    "}_@il@IANASCDCEA{@?XLIDFDo@Vn@@d@EQCLCICp@AAIO?EG",
    "qc@cq@T@HGo@BV?G@",
    "s]cq@n@AgAKB?a@B|@FG@",
    "e]oq@IBlA?cAC",
    "ka@sq@J?aABt@C",
    "}j@~]\\@?QOBDBE@QC?DN?KB",
    "kiA`ESGONFBZK",
    "whApDX@IKUBJGCAYHVD",
    "ogApDAIKA@JJ?",
    "yjApDZ?@EKGe@FMIBH\\D",
    "yfAbDOBJFJMG@",
    "ucAzCf@A\\EAGXCQQm@DIJ]BKK_@HINY@CP|AQ",
    "ueAhCS@ZBGE",
    "wkAbBEKBNE@FF?M",
    "ibAr@I@?FJ@AK",
    "caAj@LCOIGPIB?HNEBK",
    "mkAbAKRVF@MLKAONDEr@T?C_@@IJ@@OIOCUGADOGMKAEK{@JYQPXjAAFD?PKLQKc@A`@VFAWZBB",
    "eaA|ABVFI@FJE?Fl@e@Za@Tk@LGD[TKN[XQFSm@FON@DaBfALDSEEBFRUDAPGBFLGIM@GJ@`@",
    "ugAr@DRXJDSNDJKTL@QBDX?Da@LGCCFCCIFOMYEF]DFCGU_@IS[QGGLAUGCQ[AFGGIHBJIC?FYFVFIHVBEJL?UXDDWRJBHEADHLAPJFDCHNGFDF",
    "cq@wBHk@ABE_@IBLGIBBCUXK\\HNVB",
    "whAqDNJi@k@@IED?MCP`@^",
    "_lA_EBJJOQWEBFV",
    "gkAqE@[YD@FTL",
    "_y@qF@JBGIa@B\\",
    "ujAuFLWWFBLD@",
    "qlAaG@F?IL?NSANPOFFLCGOFE@HFGDU?IKBCm@YBEC?PEHTb@ETIDAGI?EJCGGBEBH@KL",
    "adAwJPJPE@OMK[EEJHN",
    "mjAwLJU?I[a@IDXz@",
    "mk@{l@MFd@?AGU?",
    "meAqm@M@JDXCWC",
    "{a@_n@iBU{@?eAM[DLFjCRZDO@FBNAEBLA?DPCIFZ@KBBBTCSBP?KBJDn@ASG`@Am@ENCWCLC[?VAQAPE",
    "c}@wo@SOWCJAYEQ@NH[G_@JvBJ",
    "g{@kp@dAKi@I}@?PFYG_@DFHL?QBDB~@A",
    "wx@_q@[@d@BG?ZG]@",
    "sx@cq@UAd@?WALAQ?IEN?KCo@CFAy@JP?EFB@bB?",
    "cd@oq@y@?VFd@ACE",
    "mf@mq@JA{@Cn@D",
    "}fBno@IGs@Dt@FCCF?G?JA",
    "wiBl[?FZLx@Ke@g@q@W_@k@IAD@GLWEFDGA@L\\Z?DGDLCTJHV",
    "e{AzYBCFNP?CEPM@GG@PQ?Oe@J_@GCZBEDJALFCCAD@",
    "olB|XJCKWZOOIGSFME?FADKCDAIJECHLOEEDBLUG?CJUBCJB?IJBHQF@OITUFQIKBL^NAHXZR",
    "ytAfUOD^?OE",
    "a}A`UHj@j@HRLJ?CFRKAEN@GABEZR|@SLM@ULIOJLKGCXBIOHMFRNBAGG?AMGK@UJVXNAHPGG?BK^e@\\ARIfBNb@LLPdA?h@Vd@ERI?OMC?]Pu@^y@MDFSCLCEEFNe@GQBQGMGJCMk@YQBcAWW[@OMQMV?KEBAGHAAIYBHAEIBB@IECIBFGK?DGIIEFCMCDKIIBONBNIMWF@GGAJGIQGABGKC@EEBGKUFGEDKLCCC_AVMIBFGA@FKKGFHPJ@CFLVkAn@YDQ]C}@GEFCSc@Qh@E^MCOLA\\KHEh@q@VQl@E@AIIHACATSH[d@BXK\\Hn@JXXTLb@",
    "egBtLCHd@SRYu@b@",
    "snBbJHHNEQMGH",
    "goBlINDDC[KFJGE?DDA",
    "spA`FQBHFHEAE",
    "emAnDk@Gd@PPNRDCO[O",
    "icB|DEFRABGQ@",
    "guAxCKEIBLNN?GM",
    "s|AbEUFH@EDz@I^g@^KDDJGGJJACD\\?YJLH^ATSCEXFCMFGI?JEK@HEJYdAYGCR?FGEKFRJB@ONIWGIDCK^BDORACK]G]H?ZEJAGGNI@QWOA@EMEeCl@YR?Lg@NAFP?CNQHITMA@HKD",
    "u_BrB?GGBOVJAJQ",
    "{|A|BTANM_@?CI?HO?OKBMQ@FLAHd@N",
    "c~AfAZSi@Z?NLW",
    "}mA|@O@AFR?BGEA",
    "soAbAH@DGDH@Ga@GUDCNPKP@",
    "wnAa@GIBZQM?FHDMJRAIVLM@e@",
    "gmAyBDBLEBKCKHGDFLGJPBEGOUMIDBFMKG@?IM??OMH@LIXFF?JHSD`@BI",
    "imAmEH@HYM@ET",
    "mmAsFEVNE?ILMQAEF",
    "iqAiSFTJFAMBHHCI[FGAHJ@?IEDFK[KAFKABFKFFF",
    "srA}SHBDJJE?GF@QOa@ACFJJFE",
    "{sA{SLICOx@DDJVA?Gk@Y{@AKa@MAHFGDi@[KYDGCMGMOFAGFBAGK@@LMTJXFABFAPFNEJTNEMDA@JHCFL?IJHV?EAHA?EDFGFJ@HN",
    "sxAqYBJZMNDHEBDQHRFFQMM@ES?GYBMECc@ZSBKG?RIAn@P",
    "kxAo`@GLBZ_@x@\\OG@LBHXUZBF?INCHNDMG[DOGm@LOC]QAFOGAEN",
    "whBoj@ZC_@ABD",
    "ioBik@TAYIBJ",
    "}vA_m@YE_@LjACQC",
    "mzAcn@}ADv@Dh@GCC",
    "cxAen@GARAMJSBnAALDh@MI?DEK?DE_@C]JUGDCqALZHTADG"
  ];
  const countryLines = [
    "cMmo@`@KeADb@D",
    "wJwo@p@Zn@Q}@GbACiAEtABl@YkAEg@PPQMEgBXt@N",
    "{Nsp@vCM{D?b@L",
    "cDkc@r@GQSX@e@SZHLSu@Cp@@KGNCc@C`@EsBYKIf@BcA]L@IQ[CT@IMk@EZ?_@GTCeE_AW@PNu@SO@HPOOm@Hp@Bm@Hb@L\\Ut@\\fAMxAZl@b@Dd@j@PQd@Vp@RSp@`@",
    "cHab@b@LAU`@c@a@}@Lk@c@GIi@iAo@o@I}@RIj@n@@Td@z@NHl@e@Px@VM@F`@d@L",
    "}Du\\d@AK[d@IFm@UGC]s@BT[cBLY|@x@Na@`@NTdA?",
    "wBu^r@OcAg@Nv@",
    "loBwg@?kA{AXOZOAPMS?mAR~@FOJRPjBY?QZV",
    "aLoa@e@N~@AYM",
    "ixAs`@e@fB\\ON^UZREHNH_CW[HKKH",
    "w~@{o@t@B{@[}@NbAF",
    "{{@gp@xAOoCCTHQFp@@",
    "o]gq@j@@eBGx@D",
    "iz@cq@dAAiASy@J|@H",
    "a\\cYdEaAg@QPMa@GVC_@KEa@xAOb@g@f@DJQ]Gb@k@`AWG{@k@Cn@IkAo@^OKI\\u@QO^WiAU[JHF{@CcB\\CPr@LdCU{@XBXu@NKI^KqAFNSq@Sg@JCk@TK_AJ^L]LyCm@PLqBMOLYKPMOEsC`@QOn@KIWLEw@e@k@@WBRVSJBf@SFf@b@r@A}@Js@]@Ug@CIVg@B^CAUjAEI]XMg@MDMSDFT_@Dk@@|@QqCBVTOGCPI]x@QBUcCEXFSHRGe@If@Mi@GNCeCQuBDNMcA@XI_AOcANTF{AEy@PnD|@sBQPEw@?YZPCEMwDLa@ScBN\\D_@Jb@EaA`@a@WqCFLGQET?_@M{BJf@J}AGNFiAPeC?k@b@JH_AYcCT@[{DT?lAlBF}@Ai@j@r@EdCz@TMnBJ^d@YFA\\RCD`@f@H?T`@@`@h@TwAUo@sD_Bl@A@P|@TAY`ABv@b@SLjAFQGx@KhDZpBfA_@B?NQIFNq@O_@RLBQPZhAdBbBd@NZKZJQMF[k@E_@_AjAJBW~@QZ{@p@OfANMNv@p@fAOpBRd@SbA@vAe@^n@`BWbBb@nAe@`AB~@iAdATEMp@?FWd@A|C\\UPh@R[VhCDhAYj@VCLXIRf@w@h@d@HLXe@t@PJVK",
    "i{A{m@^CaB@`A@",
    "yvA{l@L?kAB|@C",
    "}_@el@KQ}@?VXo@VzBUYI",
    "eb@{m@_BY}CGvEh@IFh@DSBPH|@KcAQLE",
    "sxA}m@HKP@a@LfCIi@O_CLf@F",
    "caAgFGNr@DX{@gBW?n@`@L",
    "_JyYpAs@c@?SSs@JAR~@Ec@l@",
    "k|@kH[~@Tb@NcCNQ\\b@LOHH@cAd@c@y@kBg@IG[Yd@Xt@[CCd@i@JjAz@]j@LZ",
    "caAgEGJ\\NBc@a@GFOa@M@kAfA_AOY\\ER]_ASu@d@XHTf@cAhAIn@H\\x@VGLLI",
    "~f@w[{@L|Ab@HQw@S\\@AOr@PFe@ZG`@l@jABiDsAg@Dr@Pi@DLJ[T",
    "h`@e\\PAAU^RSO|ACm@}@_@KZh@OMMVe@ELHWBPFCLQKHZ",
    "~lAk]fAk@y@Hk@b@\\A",
    "lz@um@\\Ea@K]L`@B",
    "v{@{o@VKgAFn@B",
    "x_Aqp@_BVnBCHCa@Cl@Ie@A",
    "fz@aq@MAr@Ay@C`@Ek@KgDh@lCTl@OmAC~BQg@?",
    "vcAym@~@HVEeAIfCAu@Gj@@m@QwBR\\Q_@IOTs@@zAN",
    "bq@sm@`F?^a@lAGyB@L@o@Dn@A[BPDk@F{CG_@FLN",
    "h|@cn@~ACwAUWXN?",
    "|iAmn@|@CwCWxAZ",
    "lf@er@zBBu@BfADsBE~CXe@@JDjCFiADxA?uAHpAX~@GsAPbALjDI}@K^MiAJk@Op@JPGa@EJGx@HKKkBE`A?[A|@WuBLOAbAKeBEd@?eAEn@?k@IfDP^AuAKhBJb@E_BGpCGkIQ`@G_ILf@F",
    "h{@_l@j@LpA]{@Gb@EMEiA?XNg@B?N",
    "fp@am@u@N~AIi@E",
    "dx@wl@fAVJ_@mBEXL",
    "bhAul@rBf@|@Qi@c@RI}DN`@F",
    "hr@yf@dB?a@k@iBh@d@@",
    "ln@ai@ZGm@IPP",
    "l{@yi@x@Ia@Qu@R\\F",
    "vcAml@LEy@ZIEP[m@BYf@iAXr@@a@HVFfAMbCRrA]uBExBENGaAInAEyA_@?N{AA",
    "lm@g[fDdACgArB{@`ADfA[lPF`@e@z@EWIX?WEDOZHJYUFLOLJVSSUJH?UbBeAn@L^[d@??{DuBRPIcCQdAZaBe@s@XSQ?N{@GuCZVJcBCy@`@Lc@m@I~@Ds@KoAV}BKJNWHVAQFA[i@IVCUMz@KMGLOe@KJ?iA`@ZHs@BT@UVSSYFI`@{@e@TQaADR@g@FZLWZh@LXOWP|@EQD\\PpAK{AN`A\\fAK_ATt@L\\d@Gl@WKEd@oA?eAd@}@AGx@s@\\FMQBGSZq@aAa@DYb@Q[]RMMMLOyACuA^BNZ?[BLTi@DVLaAI_@g@a@^NFSCLHe@PVDm@RFNaAFdANIHo@Qm@PNLKLnA^bC?~@j@ZE[DzAx@",
    "jl@ii@j@[b@FSIbA]JDOHjCA|@ILKs@@|@Q[]gAG^Te@Zf@Dg@@CO\\Ee@?\\Qa@@\\EoAKYRNNsBKVJiBJ\\Lg@IPT}@Kh@Nu@IMJx@B_ABr@FaDl@j@L?Rf@QUKvABqAj@HZjAWy@d@hBWd@_@bB?_BORKe@_@",
    "j~A{b@ZLNK]MMJ",
    "fpA}a@LTDYVHMKjAaACXf@QULLBv@e@|A@dAYRHODHHfALSIP@ISo@CTEMEhAVVVSBdBx@`BVuBu@Ka@jBJEi@j@PXOc@Er@Mc@_@aAGFOMEjB@NKS?h@IkAQaAF\\Om@JbCg@mE{@uH`@?zDe@?_@Zg@QmBlA",
    "|q@eR]lAF^XMf@oAtAOn@HSB?TpBOt@j@G`@`@Kl@cAf@Nz@u@|AFfA[n@BdAi@d@y@UIl@QPmAKcAO?PAJi@e@D@TMSJSgPGgAZaAEsBz@BfA{CaAoAC_@m@]FOl@`ATLXULnAFHd@VCC^PIIUNDEXNQOb@RCc@\\HQCJPCSHZDOHzAp@Jb@",
    "xy@aIhA@nCaANaAfA{@EM|@u@Pk@d@OIf@cB~BHL|@qAd@MS?@Oz@oAo@CgAZ}AG}@t@e@Om@bAg@FJvA_AbA{@C[w@aACR~@BMPRh@@K`@X?H\\d@]",
    "zi@fa@bAE{@?VMOGTAUOO@?j@",
    "vi@t_@p@FFVVIUMb@Ha@Kf@FKINIWF?KTBLUMITCSIPa@[?\\EKQ^?USQLUg@LGSu@VFFMCkAi@kAWoHQO_@hBQB\\^Cn@l@tAOx@l@fDSd@RDOHFZd@v@_@p@gAD",
    "kOlNNRn@Gl@^LaBS??iAuAIiAnAv@x@",
    "gdAbDnB[QQw@Pi@GcAZCPjAI",
    "mkA~@KVVFLi@NDEr@T?Jw@WeAgBSPXrABK^u@Oh@VSZ",
    "caArA?^V@l@e@lC_Em@FoB|ALDYAFRUDAb@UGCb@",
    "epA`Ah@Aa@GYTPK",
    "{gAn@d@b@DSpACVyAIKSVmAIY{@[?In@YRTAXdA",
    "cwAtDNWXFD[K@T_@pA]@SRVPYe@M^BT]w@AUt@u@e@_AT?`C",
    "snASKWDZSOCZRAIVRe@",
    "np@bBXKMo@HLLIQ{@YKeA\\APnAnA",
    "g}AxBp@Ks@?Y[@ZXJ",
    "m|A~DWRz@I^g@p@M?N\\?YNn@@?aCaCbAD\\m@h@",
    "fq@_DHNf@O?_@]No@Oc@`@LLTe@ZT",
    "imAoB^k@b@L]_@ELc@S?OUp@FRHSF`@",
    "mlAeG`AMNi@Os@_@?EZTb@GVe@BCN",
    "vv@}HQs@?f@PJ",
    "kyAyYZRt@MMNRFFQ_@SIk@c@Z_@CIPVH",
    "mqAmSV`@@c@RK[KQX",
    "}rA}SXNRKi@UCP",
    "_tAaTPCCOvAFk@Y{@AKa@KJi@[Io@_@OKb@V^?l@h@Tf@INZ",
    "adAyJPLRUi@QBX",
    "ifAaMLKAP|@N@TL[l@@f@c@fAPAZ^EXu@ZBYu@Te@|@Oj@\\l@IVRDOr@BlAo@RDn@YDWUCH_@zAw@OEFUVQcCs@KUPc@s@CIi@q@@[g@cAZKp@yAPS^kDTkBW]Q@Yc@DkAe@q@AZYz@AWa@s@E]_A_BBe@`A_APEViAK^~@j@DFl@JIb@^ZElBz@Mm@rAd@[d@gACdAn@u@`Al@Mo@\\d@Lg@Dz@jAKL~@p@n@F",
    "sO{d@hAN\\OAs@mAc@`@W?c@|@SuAF_@Yw@FPR_@NPN]t@JH_@NbBl@",
    "n`@kj@VO{@Jp@BM?",
    "v^sg@XNQOZEi@Gz@EeASdAPYMb@EiAAfAAkAChAAgAE~@Gq@EM[vAMqAB|@e@FRd@E_@Ob@c@VBUI|A_@tC@VE_@EbAEiBIjCMqCQg@UhAAcCQFKmLKlCKeA@f@EgHGcBDfEF}GDdFNiFAv@XsAUeDBzDPcBBvADYP|@\\y@?b@Bo@NrA?cAR|@HcALdABg@PfBKSHz@Fs@?l@DmBTJFSNlC_@_ALjARy@?j@F_CApCd@|@GILt@^p@HLK~@XMLV@UJt@PSFNAQHTLKBR?QF\\@UHh@?MIZ@COp@Hh@a@KKd@K]G`@A_@EJAWDVM",
    "jkAnm@TK}@Bf@F",
    "nmAzl@c@NhAOe@?",
    "tbBzp@~AIe@Iy@R",
    "vd@pq@~BKuCATL",
    "t^pp@_@W_AEi@H^Ho@PbFRiA[",
    "lj@rp@l@@gBUx@R",
    "v{@hl@dBGiCBb@B",
    "moBts@?nBz_F??mB}MNlJo@mIJMC`@AyBKzAW}DGbAImAIzDWu@IxAC?Q_GFPIQCrAG}Gc@oGBwCQSHRLs@Q]DXLcG?zA_@qA?pAQmFJc@MoCX_@QcAPeDOg@Sf@u@g@ELESYRGSBs@m@cCc@IFjB`@WRv@A?Lb@HGVm@CRJ{@j@\\Lq@Rj@BYHVJSDrDj@xCCcBTZHdCGP@wANbCCcAVwACfAJcA@MNkGLpADuBDn@DaARgBYoDDeC_@eIStGYuCk@sEQJEYO_AIh@GeBUKK^Gi@Ie@No@S@LoBFmGc@}GRkBSIYqB\\S[cC]e@LSORCq@BJOcAKgANX?MDHHkGFA\\p@Rg@@x@t@QBuAa@a@a@_Fw@_HCmAS{BTuAWs@Rh@LeCIZFiIYsDPJPi@EUNgCAuBVq@^EOyCRMHLNf@C_@DLJ|A?QX~ANm@FJVm@PNDcAHnBCIJr@Lg@@`AHs@?RB]Bb@@wAX|@D}Jb@",
    "ll@dl@s@AhBIoBI\\Ia@Ej@GBSe@Ac@f@P^dAC",
    "kk@}Kh@_@_@OXBRQy@K^u@o@Qw@}@MWZQE_@iAM]v@TBEVm@TRZsBj@k@BKa@IXw@?DS{@]u@TBTf@HRt@NCFh@Ja@LNHM[Yt@GZYKXRLUz@VO\\n@xBtAN`Cd@TpA_DJ{Bd@^",
    "jg@sAWh@x@X^g@GcAbBYPa@Qe@WMDv@?c@c@MBMe@`@}BCVJk@LNNc@D^n@ORl@X`@K",
    "|`@gBIIi@XVj@`@AEy@",
    "a@qYbAOKm@KJJYfAm@aA?HUm@Bi@_@qBh@j@v@OCMr@rBX",
    "pu@cGh@[[]{@Ae@RrAf@",
    "|m@mKr@@IO|Ai@z@NuAYaCx@RF",
    "oMuV?\\L?Z]i@Ef@AV[SUoBOHPn@AENZIMXND_@LPD",
    "kH}Up@Y_AEL^",
    "kDkWFe@SGGf@RD",
    "kIaWPH@i@xAm@R_@r@BLg@kBY]JAP^DCTyBpA\\GFf@",
    "tB{`@l@Eg@MER",
    "Dq`@ENa@@XXSFlCRaAa@v@@S]]CPUKIh@BE[RPO[V?OGFMw@OZRs@@f@Zk@HYd@",
    "yY{Ea@JqAQCb@d@\\fA[H_@",
    "e{AvY\\NXy@eA@Lf@",
    "e}A|TLn@fA^\\WZR|@SRq@XB?]VVQw@b@p@l@y@p@KdHdA\\MMq@p@oBMDFSMNJiA_Ai@uASc@}@MV?[YBHQa@_@Y?K^IMWFQw@k@ENS_AVMIALKKVz@eBt@i@iCWhA]HSpAq@VQl@SAq@dA@fBn@nA",
    "uRwL`C?CaEkAPgBIMb@Jb@f@e@{AvCjB?",
    "iQbB]~@d@DHz@[L?Xr@e@bBGFmAl@E@Rb@@Rk@vAAQW_@DWSc@cAO_BUQu@T_BUiA\\I\\n@zAGr@",
    "kJ_Dt@H^i@c@Gl@wAi@q@IcARu@SG_DlA?jATBTt@Ud@|Ax@",
    "o_@{J{@SQcBmAp@f@dAv@f@d@FTo@",
    "w_@aYESp@e@}@M@[|A@f@c@G]e@?BMk@WiAXiCEZWi@SVKGIwCYe@@GVq@?DLeAU_AhAaACmAd@^LBXp@AHh@r@BQb@JPvBULPl@Et@h@b@Kb@q@x@BdAi@p@J?hAd@S`@J",
    "mVmS`@?O]P[QWqBGXv@dA`@",
    "{a@mNLh@p@ERWw@Cc@c@FZ",
    "gPcc@`AAPU{AIF`@",
    "mLeb@CYg@J_@Uk@JMVdC?",
    "qNy`@ZBn@k@kAEa@L`@^",
    "yKwXKSe@Hp@H",
    "uK{WRKGm@Yf@LP",
    "i\\oWd@i@gAIc@Z\\f@PYTH",
    "e[yXfAC@WZMgBL]Z^?",
    "s[}WMRv@WDS_@COZ",
    "~a@lR^QmAoAj@mAh@CImANe@d@?Dq@xAc@Fm@fBXA_@`@Jb@q@Uo@y@OK}@Lc@SANSq@Ge@Zi@]Zi@e@Lu@a@GbASLw@M?K}@D[k@_@~@v@v@e@M?T[CDPa@g@W?k@RB^[ScAHyAl@Mh@Hf@fAdABbBd@tAxCbA?|@bAhA]a@LIf@hAH_@j@S",
    "n]Zb@F@]m@?FT",
    "zB}_@z@VXMa@IT@SKXCAO_@?UWNPi@H@X",
    "|EqCh@QMa@c@JFf@",
    "nG}D\\[[c@{@N[K_@pAZVL[PDHa@n@H",
    "gIu@d@s@Mg@cAMkA{@Ul@mAfAd@E~@Xx@SN^d@?DN",
    "}TmFRn@Zu@\\n@zADNQl@`@`@qAUu@UC?uAS??g@mF?I|@WP^PPvARN",
    "_ZcFZFYa@JTMB",
    "yNbJd@CZ[?_Ag@??i@_ALs@d@?YZMI{@e@Eo@Z?vAz@R~@x@`@A",
    "_Em\\cAGDKm@Qi@Rr@^`BM",
    "u@_Cc@qCeBPoAQU\\~@nB`@C\\l@j@BN_@r@I",
    "q@}BP@NsAg@g@Sb@XtA",
    "qHo[`@@BOy@IRV",
    "wJu[l@K@WwAQi@Jb@`@l@F",
    "q~@cCJRx@{@[_AZaAMY\\k@g@c@e@NFf@}@Ma@t@JZv@LKd@f@UAORBNnAq@t@",
    "zk@gJCe@aAXdAJ",
    "xk@mJv@Ai@ATWMCSBAZ",
    "_]kQGPd@KQSKL",
    "i]wQjANnBy@DYk@SGi@aAM_@ZPb@g@^Un@",
    "wQl@TB_@[EVN?",
    "}QVLEa@}@F]}@ISl@Tx@fAB",
    "qLkYp@YDo@YCs@\\C\\XP",
    "uJoYEU[JRRLI",
    "~v@mGCQa@Jd@D",
    "{@w^g@M[VPNp@Y",
    "mDy[t@Aq@_@g@Pb@N",
    "oJsYr@s@gADRl@",
    "{Ja]j@Ec@UmAFdAR",
    "qIk^e@LxAPj@a@o@Mo@N",
    "iO_Y~@DHu@{BDTVIHd@F",
    "sPm[]DT\\pBAt@m@y@g@gAC]v@",
    "uQc\\`@T@[\\[q@DOZ",
    "_Ms]g@y@yBLu@Wo@f@{ATH\\`B^a@Tr@LZSUMb@COEPMf@h@T?EYW@R_@zB@HU",
    "ee@sRMJRPq@v@d@f@pAMHY|@Fl@WXm@^BTo@XKLSQc@RCXcAq@H]OUf@w@TyAa@y@Ne@PLp@Kt@",
    "_XjEp@\\p@APi@|@Q`@kA]_@Di@eAAgAf@_@`@OlB",
    "{QnANFDc@]CF^",
    "oUwAz@eAUMo@qB[Ky@N_@^J\\U?Uf@oAR|@|@|@Rl@HdAS",
    "aSgAtAShAiASg@y@Rg@SWHWYDQUCQfATLy@`AjAR",
    "uG@El@b@IXf@n@aAYOFOa@?AYe@@@PYFJR",
    "FmBt@FEuBs@AKNOrA^J",
    "hBgBj@NA[VMSmAaBP@tAp@?",
    "hBqUj@]@i@[e@t@EDY]K{E\\r@\\Z~@zA\\",
    "jw@sGf@]c@OJa@c@??d@SBf@d@",
    "xr@uD?Tz@y@m@?Mb@",
    "rj@a@MRR@Mb@Jz@LGKWv@Cd@k@rAc@g@m@F}AKLYu@kAe@KHl@v@Qb@cBVFbAS^HQn@F",
    "ii@kWMNJRXC|CkBr@\\?iAq@KeAh@y@Cc@p@c@Jq@a@NNy@LZLl@M`@b@",
    "_e@uQSUVi@Mq@[F}@o@eAHa@[Kb@aAI`ALHn@V@Jh@r@LHZjBA",
    "gVoREVr@JM_A_AOIVh@R",
    "e[aG^BPq@Kk@oAHc@a@{@GUn@PRlCt@",
    "{DwQ?jAs@t@zBpAp@FnFeDE_@y@Ks@s@a@?R{@eBa@qBATz@e@lA",
    "tFgHh@e@h@PIk@RaAoA?S}AaA??YmAl@b@?U|DvBANN",
    "`IoGZWWa@e@Ck@f@Ol@hB@YIXGy@Cl@C",
    "~GgFLLAU`@E{@GLT",
    "k\\eAlBfBHyAU[w@M}@}@Q_Ao@KAZvAhC",
    "}X`@l@z@hBiAUy@Rm@[Ou@ZkAGPVIxA",
    "}DqARGEY}@Yu@wAB_@Y|@b@Fa@b@Vb@c@tAzBIHe@",
    "aFa@?Lf@CIU]J",
    "iIzP|AaFgGDZPr@C?hAR??~BdAB",
    "WyBZcBU@Md@Fz@",
    "L{Eh@??^t@S]}@kA_@s@~@|@P",
    "_UfI@LJq@b@SS{@LW]J?`A[^L\\",
    "mSdOCPN?NwAa@o@?aAr@MBSqAKSt@Kk@Z_@Aa@y@@{@WAbBxBpASxAv@b@",
    "_IjAXTDKn@LPUOEDYw@GAw@XGAQw@HIc@e@ANpA`@`A",
    "woA_UBBFCBFDA?CHBABDAABBBBAAEJH@EB??CCB@AC@BAEAD?@EA@@CGEBAEEDAGAF?AG@CB@BCCCAB?CC@@CGDACDCCADA@GEB@EEEUAEEMPEJ?TC?FN",
    "sZuVKNbDDFRBU~@Ph@QRNl@KQER?TYSADWN@KQcC_@cBTwAMi@f@NBC\\",
    "{OkXNHGe@q@Nh@J",
    "_jBb[`@^z@KwBkBc@FVx@d@T",
    "emBnX`@HKWZOUk@j@u@a@NE`@mANl@|@",
    "do@pFrAwCSUBR[JmAcBm@n@w@DJTMHx@NTn@c@p@a@K@^S?Q\\L|@KLTb@hBu@d@aA",
    "hs@yEh@Cd@e@{Ag@JpA",
    "{[vNRF\\YFm@Wg@Jq@IYgA[Yy@WdAP@f@fDZX",
    "uYwFp@g@hA@Iw@_@QUx@]H]j@",
    "sN{O?jCRH~CmAb@NlAg@RmBk@}@wCx@Wi@c@Iy@R?`B",
    "wMfTfBD@o@b@aAeAC?gAMh@S?Y_@q@FeAeAm@BM~@VVi@?H`@xAxAtAR",
    "tL{f@NCWMr@Co@Kv@?i@GJKe@XMQm@Hi@Qq@Z|A^hAE",
    "vC_BjAe@Uc@OTUAOt@",
    "rIkLq@_BuA}@QaAq@[Qc@qATKr@`@?r@r@x@JFb@r@B`AjBl@@",
    "si@{Mb@c@|AJAW]Qp@w@kB@I[s@MKi@WAIo@sACW`@|@FAZ[PLVv@|@n@P_@t@x@J",
    "w_Au@MXz@[TmAy@XIt@",
    "}fAaBa@i@q@`@VFIHv@?Xz@lAHPMa@B?YiAk@",
    "aEya@APTAJa@q@UNTUDVJ",
    "_FeS`@h@d@eAKw@SMe@DJNMPVR]RDP",
    "s\\uInAGJTdAyALu@nAyAEY}@URScAGuAt@iALsAnBs@BBt@vBZ^\\",
    "qw@kMBTDKNNVy@SMJY[Xu@FZVINMO?z@Fa@ZK",
    "_nAuVDBHEA@FBCCH?ECJ?EA@ACGI@HCEOLC@BBI_@OMO[DCCDGQ?GGG?CKE@IJD?LL?Nj@TAFBA?BQF@FR@HHDA",
    "mg@aVn@b@T]nAa@`ARV_Ai@IRUPRHKa@Ky@RY[_@FCPaCbAd@T",
    "{GzIn@Cg@yB\\cBsACUj@c@AASm@DGlAc@C?f@f@??~@[ZvDC",
    "tCmV\\HCi@LFYeAg@JZd@Aj@",
    "zi@z_@cAj@bA??k@",
    "fi@v[c@d@~@h@M@X\\WLfAE^q@e@w@G[NISENA@iAk@aCNy@m@uABo@m@w@e@T]QcB~@Nh@w@@e@c@A\\pAdALhAe@r@^^pADAh@v@AAX[LXAKDVd@h@T",
    "yfBlLQNz@k@i@Z",
    "zc@YR[?o@ZO[u@]XBP]DNh@]h@p@J",
    "mq@wBNOMs@JGe@p@VX",
    "qjA{LN[[a@J|@",
    "~a@xTn@SOiAyAp@L`@j@H",
    "|e@bLFVVCFPd@U`@Rb@mBQSJMM}@P]sAYGl@yAb@Ep@e@?Od@Fb@jAGJZ",
    "qTwRYc@PlAFi@",
    "ew@uOVGWWk@Rj@J",
    "iPe_@pA?@o@m@Em@g@w@Jc@j@XBGTXPv@E",
    "obAoYz@NjDUR_@xAQJq@p@]{Aa@aBV_@o@wAd@cAAe@RwCMJh@y@A[T|Bj@b@EAXlAX",
    "w`A}GG[^s@|@LGg@VMa@Q@Yy@d@NXgA~@?^j@B",
    "kk@cXi@Kx@MWYi@FMQyBV`Cr@xA?a@M",
    "mL{]dC]J{@iAQkBJOhAV\\ZG",
    "ki@gVKSRY{@]KN`@LuA@_@f@dALLc@`@Z\\A",
    "xA}FRl@p@BRk@p@DLm@MWwB@T}Dc@?}CtBU?LhArADjAn@",
    "sSxI?t@`@n@`AOv@iAc@?w@m@_A`@",
    "oR~OC]MTPF",
    "da@wBMDBv@p@PVw@QWm@?",
    "~`@lNZt@v@AOi@~Ay@Os@gA@Cl@i@B]n@",
    "et@uP}@H@X`Do@_@]eAh@",
    "wPzQZI_@UOLRP",
    "gCgGl@IPf@VCj@}@aAGMiA{CwA{@HSt@HbAd@~@fCH",
    "lDiP?`@`A?R|ApAHo@MaAkBu@O"
  ];
  const landBands = [[-1545,-657,-82],[-511,-475,-82],[-432,1631,-82],[-1581,-838,-78],[-837,-805,-78],[-769,-735,-78],[-488,-448,-78],[-355,1645,-78],[-1227,-1203,-74],[-1016,-617,-74],[-147,1646,-74],[-718,-692,-70],[-685,-622,-70],[328,382,-70],[388,679,-70],[731,1603,-70],[-645,-623,-66],[520,555,-66],[1012,1036,-66],[1112,1139,-66],[-701,-674,-54],[-740,-690,-50],[-737,-676,-46],[1668,1703,-46],[-725,-651,-42],[1452,1481,-42],[1714,1740,-42],[-735,-575,-38],[1405,1447,-38],[1450,1477,-38],[1748,1771,-38],[-719,-584,-34],[-583,-535,-34],[183,226,-34],[1150,1198,-34],[1375,1512,-34],[-714,-501,-30],[172,309,-30],[1149,1532,-30],[-706,-486,-26],[149,325,-26],[1142,1532,-26],[-702,-410,-22],[142,353,-22],[433,481,-22],[1146,1495,-22],[-709,-395,-18],[118,369,-18],[440,494,-18],[1224,1461,-18],[-763,-390,-14],[124,406,-14],[479,502,-14],[1297,1359,-14],[1415,1437,-14],[-782,-360,-10],[133,397,-10],[1477,1499,-10],[-811,-351,-6],[129,388,-6],[1383,1475,-6],[1489,1511,-6],[-808,-505,-2],[-493,-445,-2],[95,409,-2],[1009,1046,-2],[1101,1165,-2],[1192,1215,-2],[1321,1342,-2],[1372,1391,-2],[-786,-506,2],[98,453,2],[984,1008,2],[1112,1178,2],[-773,-572,6],[-102,11,6],[49,489,6],[1004,1024,6],[-848,-830,10],[-756,-720,10],[-712,-628,10],[-140,509,10],[763,792,10],[-914,-834,14],[-165,416,14],[431,479,14],[745,802,14],[982,1093,14],[-1024,-881,18],[-160,386,18],[417,564,18],[730,836,18],[945,1065,18],[-1056,-977,22],[-804,-780,22],[-169,369,22],[389,597,22],[692,721,22],[725,880,22],[919,1124,22],[-1094,-973,26],[-145,343,26],[367,501,26],[572,1192,26],[-1127,-898,30],[-838,-813,30],[-97,326,30],[326,479,30],[501,1217,30],[-1185,-780,34],[-69,100,34],[356,1204,34],[-1224,-769,38],[-89,-7,38],[271,489,38],[538,1190,38],[1258,1288,38],[-1242,-707,42],[-89,32,42],[120,150,42],[191,280,42],[418,484,42],[539,1300,42],[-1239,-732,46],[-732,-647,46],[-11,304,46],[381,487,46],[531,1378,46],[-1272,-1252,50],[-1239,-669,50],[12,1405,50],[1422,1440,50],[-1286,-822,54],[-791,-589,54],[-99,-64,54],[-28,-2,54],[89,108,54],[115,138,54],[147,1367,54],[1559,1599,54],[-1576,-1550,58],[-1337,-928,58],[-771,-688,58],[-677,-633,58],[118,167,58],[244,1406,58],[1583,1620,58],[-1658,-933,62],[-781,-726,62],[-491,-425,62],[53,174,62],[212,1631,62],[1641,1751,62],[-1788,-1701,66],[-1668,-1619,66],[-1618,-861,66],[-742,-683,66],[-648,-625,66],[-518,-385,66],[-174,-146,66],[129,347,66],[409,435,66],[441,1799,66],[-1625,-1453,70],[-1174,-1009,70],[-963,-920,70],[-777,-698,70],[-503,-275,70],[-273,-225,70],[235,295,70],[672,725,70],[737,1599,70],[-1244,-1192,74],[-1191,-1166,74],[-953,-923,74],[-561,-220,74],[547,577,74],[870,1090,74],[-1124,-1096,78],[-1008,-990,78],[-975,-950,78],[-854,-828,78],[-826,-782,78],[-782,-764,78],[-723,-216,78],[144,185,78],[212,231,78],[-849,-806,82],[-799,-625,82],[-595,-536,82],[-497,-460,82],[-449,-311,82],[-290,-251,82],[-232,-212,82]];
  function readLine(s) {
    let i=0, lon=0, lat=0;
    const path=[];
    function delta() {
      let shift=0, total=0, code;
      do {
        code=s.charCodeAt(i++)-63;
        total+=(code&31) << shift;
        shift+=5;
      } while(code>=32);
      return (total&1) ? -((total>>1)+1) : total>>1;
    }
    while(i<s.length) {
      lon+=delta();lat+=delta();
      path.push(...globePoint(lon/10,lat/10));
    }
    return new Float32Array(path);
  }
  function lineBetween(start,end,step,point) {
    const path=[],count=Math.max(1,Math.ceil((end-start)/step));
    for(let i=0;i<=count;i++) path.push(...point(start+(end-start)*i/count));
    return new Float32Array(path);
  }
  let atlas;
  function geography() {
    if(atlas)return atlas;
    const grid=[];
    for(let lat=-60;lat<=60;lat+=30) grid.push(lineBetween(-180,180,3,lon=>globePoint(lon,lat)));
    for(let lon=-180;lon<180;lon+=30) grid.push(lineBetween(-90,90,3,lat=>globePoint(lon,lat)));
    atlas = {
      grid, coast:coastlines.map(readLine), borders:countryLines.map(readLine),
      land:landBands.map(([a,b,lat])=>lineBetween(a/10,b/10,2.5,lon=>globePoint(lon,lat)))
    };
    return atlas;
  }
  const latitudes = stops.map(c=>[c.lon,c.lat]).sort((a,b)=>a[0]-b[0]);
  function viewAt(lon,focusLat=null) {
    const normalized=((lon+180)%360+360)%360-180;
    const next=latitudes.findIndex(([x])=>x>normalized);
    const i=next<0?0:next, a=latitudes[(i+latitudes.length-1)%latitudes.length], b=latitudes[i];
    const span=(b[0]-a[0]+360)%360, u=((normalized-a[0]+360)%360)/span;
    const blend=u*u*(3-2*u);
    const lat=(focusLat??(a[1]+(b[1]-a[1])*blend)*.88)*radians;
    return {sin:Math.sin(lon*radians),cos:Math.cos(lon*radians),tilt:Math.sin(lat),level:Math.cos(lat)};
  }
  function projected(v,a,b,c) {
    const facing=a*v.cos+c*v.sin;
    return [c*v.cos-a*v.sin,facing*v.tilt-b*v.level,facing*v.level+b*v.tilt];
  }
  function trace(ctx,line,v,raised) {
    let connected=false;
    for(let i=0;i<line.length;i+=3) {
      const a=line[i], b=line[i+1], c=line[i+2], facing=a*v.cos+c*v.sin;
      const x=c*v.cos-a*v.sin, y=facing*v.tilt-b*v.level;
      const visible=facing*v.level+b*v.tilt>=0 || (raised && x*x+y*y>1.002);
      if(visible) {
        if(connected) ctx.lineTo(x,y);
        else ctx.moveTo(x,y);
      }
      connected=visible;
    }
  }
  function stroke(ctx,paths,v,colour,width,r) {
    ctx.beginPath();
    for(const path of paths) trace(ctx,path,v,false);
    ctx.strokeStyle=colour;ctx.lineWidth=width/r;ctx.stroke();
  }
  function marker(ctx,x,y,size,colour,ring=false) {
    ctx.beginPath();
    ctx.arc(x,y,size,0,tau);
    if(ring){ctx.strokeStyle=colour;ctx.stroke();}
    else {ctx.fillStyle=colour;ctx.fill();}
  }
  function packet(ctx,path,u,v,r,colour,owned=false) {
    const pos=u*(path.length/3-1),start=Math.min(Math.floor(pos)*3,path.length-6),f=pos-start/3;
    const [x,y,z]=projected(v,path[start]*(1-f)+path[start+3]*f,path[start+1]*(1-f)+path[start+4]*f,path[start+2]*(1-f)+path[start+5]*f);
    if(z<0 && x*x+y*y<=1.002)return;
    ctx.globalAlpha=owned ? 1 : .7+Math.max(0,z)*.2;
    marker(ctx,x,y,(owned?2.6:1.8)/r,colour);
    if(owned) {
      ctx.lineWidth=.8/r;ctx.globalAlpha=.75;
      marker(ctx,x,y,5.5/r,colour,true);
    }
  }
  function mount(host) {
    const canvas=document.createElement('canvas');
    canvas.setAttribute('role','group');canvas.tabIndex=0;
    const hint=document.createElement('p');
    hint.className='horizon-pick-help';hint.id='globe-pick-'+(++globeCount);
    canvas.setAttribute('aria-describedby',hint.id);
    const controls=document.createElement('div'),region=document.createElement('span');
    controls.className='horizon-controls';region.className='horizon-region';
    function control(symbol) {
      const item=document.createElement('button');
      item.type='button'; item.textContent=symbol;
      return item;
    }
    const back=control('‹'),forward=control('›'),toggle=control('Ⅱ');
    controls.replaceChildren(back,region,forward,toggle);
    region.setAttribute('aria-live','polite');
    const figure=document.createElement('figure'),explore=document.createElement('div');
    const caption=document.createElement('figcaption');caption.className='horizon-voice';
    figure.className='horizon-map';explore.className='horizon-explore';
    const legend=document.createElement('div'), peerKey=document.createElement('span');
    const liveKey=document.createElement('span'), cutKey=document.createElement('span');
    legend.className='horizon-legend';
    peerKey.className='horizon-peer-key'; liveKey.className='horizon-live-key'; cutKey.className='horizon-cut-key';
    legend.append(peerKey,liveKey,cutKey);
    const countryState=document.createElement('p');
    countryState.className='horizon-map-key';
    countryState.setAttribute('role','status');
    const panel=window.FederationPanel.mount(plan=>{applyPlan(plan);refresh();},
      id=>{if(active)choosePlace(resolvePlace(id));},'solidarity');
    host.classList.add('horizon-sky');
    figure.append(canvas,controls,countryState,legend,caption,hint);
    explore.append(figure,panel.element);
    host.replaceChildren(explore);
    host.hidden=true;
    const ctx=canvas.getContext('2d'),motion=window.matchMedia('(prefers-reduced-motion: reduce)');
    let active=false,visible=false,paused=false,rotating=true,frame=0,previous=null,elapsed=0;
    let longitude=home.lon,latitude=home.lat,language='ko',cameraOrder=countryPlaces;
    let cameraFlight=null,gesture=null,inspected=home,origin=home;
    let liveEdges=[],backgroundEdges=[],cutEdges=[],dispatch=[],members=new Set(),sources=new Set(),lost=new Set(),labelled=new Set();
    function applyPlan(plan) {
      if(!plan)return;
      origin=byId[plan.origin?.id]||home;
      const edges=plan.lines.filter(edge=>byId[edge.from] && byId[edge.to]);
      members=new Set(plan.members.map(place=>place.id));
      sources=new Set(plan.providers.map(source=>source.cityId));
      lost=new Set(plan.blocked.map(code=>byCountry[code]?.id).filter(Boolean));
      cutEdges=[];liveEdges=[];backgroundEdges=[];
      const incident=(edge,id)=>edge.from===id || edge.to===id;
      // Every shared foundry pair is visible. Treaty access remains a finer
      // line, while the inspected beneficiary's supply options come forward.
      const paths=new Map();
      const edgeKey=(from,to)=>from<to ? from+'|'+to : to+'|'+from;
      for(const edge of edges){
        if(edge.kind==='cut'){
          cutEdges.push(route(edge.from,edge.to,.15));
          continue;
        }
        const local=incident(edge,inspected.id);
        const lift=edge.peer ? .12 : .045;
        const path={...route(edge.from,edge.to,lift,edge.peer ? 48 : 30),peer:edge.peer,local};
        paths.set(edgeKey(edge.from,edge.to),path);
        if(edge.peer || (local && !sources.has(inspected.id)))liveEdges.push(path);
        else backgroundEdges.push(path);
      }
      // Synthetic reference packets trace only the current, permitted route.
      // A cut origin has no running request, even while other foundries collaborate.
      dispatch=(plan.workBatches || []).map(batch=>batch.flatMap(({from,to})=>{
        const arc=paths.get(edgeKey(from,to));
        if(!arc)return [];
        return [{path:arc.path,reverse:arc.from!==from}];
      })).filter(batch=>batch.length);
      labelled=new Set([inspected.id,origin.id,...lost]);
      if(inspected!==origin) {
        for(const edge of liveEdges)if(incident(edge,inspected.id)){
          const id=edge.from===inspected.id ? edge.to : edge.from;
          if(sources.has(id))labelled.add(id);
        }
      }
      showRegion();
    }
    function rebuild() {applyPlan(panel.refresh(countryPlaces,inspected,language));}
    function updateControls() {
      const c=copy[language];
      for(const [el,label] of [[back,c.previous],[forward,c.next],[toggle,paused?c.play:c.pause]]) {
        el.setAttribute('aria-label',label);el.title=label;
      }
      toggle.textContent=paused?'▷':'Ⅱ';
      toggle.hidden=motion.matches;
      showRegion();
    }
    function showRegion() {
      const place=inspected;
      const name=countryName(place,language);
      if(region.textContent!==name)region.textContent=name;
      const c=mapCopy[language];
      const state=lost.has(place.id)?c.suspended:sources.has(place.id)?c.source:members.has(place.id)?(sources.size?c.access:c.offline):c.outside;
      if(countryState.textContent!==state)countryState.textContent=state;
      const text=copy[language];
      const conclusion=!sources.size ? text.empty : lost.has(origin.id) ? text.homeCut : text.title;
      if(caption.textContent!==conclusion)caption.textContent=conclusion;
    }
    function paint() {
      if(!active || !ctx)return;
      const w=canvas.clientWidth,h=canvas.clientHeight;
      if(!w || !h)return;
      const dpr=Math.min(window.devicePixelRatio||1,2);
      const bw=Math.round(w*dpr),bh=Math.round(h*dpr);
      if(canvas.width!==bw || canvas.height!==bh){canvas.width=bw;canvas.height=bh;}
      ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
      const r=globeRadius(w,h),v=viewAt(longitude,latitude),geo=geography();
      ctx.save();ctx.translate(w/2,h*.50);ctx.scale(r,r);
      const sea=ctx.createRadialGradient(-.28,-.45,.04,.06,.16,1.24);
      sea.addColorStop(0,'#19272c');sea.addColorStop(.66,'#121e24');sea.addColorStop(1,'#10161b');
      ctx.fillStyle=sea;ctx.beginPath();ctx.arc(0,0,1,0,tau);ctx.fill();
      stroke(ctx,geo.grid,v,'rgba(130,161,169,.26)',.64,r);
      stroke(ctx,geo.land,v,'rgba(145,175,158,.17)',.70,r);
      stroke(ctx,geo.borders,v,'rgba(158,177,159,.40)',.67,r);
      stroke(ctx,geo.coast,v,'rgba(178,195,173,.81)',.87,r);
      stroke(ctx,window.GlobePicking.outline(inspected.region),v,'rgba(152,211,196,.76)',1.12,r);
      ctx.beginPath();ctx.arc(0,0,1,0,tau);ctx.lineWidth=.85/r;ctx.strokeStyle='#617b7c';ctx.stroke();
      const t=elapsed;
      // Keep supply interruption and shared work visually distinct at rest as well as in motion.
      if(backgroundEdges.length){
        ctx.beginPath();
        for(const edge of backgroundEdges)trace(ctx,edge.path,v,true);
        ctx.strokeStyle='#8cbaad';ctx.lineWidth=.65/r;ctx.globalAlpha=.52;ctx.stroke();
      }
      for(const edge of liveEdges){
        ctx.strokeStyle=edge.peer?'#a1d8bf':'#a9e0d0';ctx.globalAlpha=edge.local ? .9 : .60;
        ctx.lineWidth=(edge.peer ? (edge.local ? 2.05 : 1.6) : 1.0)/r;
        ctx.beginPath();trace(ctx,edge.path,v,true);ctx.stroke();
      }
      for(const edge of cutEdges){
        ctx.save();ctx.setLineDash([2.5/r,4.3/r]);ctx.strokeStyle='#dd9295';ctx.lineWidth=1.5/r;ctx.globalAlpha=.89;
        ctx.beginPath();trace(ctx,edge.path,v,true);ctx.stroke();ctx.restore();
      }
      if(dispatch.length && !motion.matches){
        const progress=(t/2.2)%dispatch.length, segment=Math.floor(progress), u=progress-segment;
        for(const arc of dispatch[segment])packet(ctx,arc.path,arc.reverse?1-u:u,v,r,'#eaf5d8',true);
      }
      const labels=[];
      for(const city of mapPlaces) {
        const [x,y,z]=projected(v,...city.point);
        if(z<=.015)continue;
        const id=city.id,chosen=city===inspected,member=members.has(id),source=sources.has(id),cut=lost.has(id);
        const colour=cut?'#df9799':chosen?'#f5e6bd':source?'#bedfc4':member?'#8cc8b5':'#708281';
        ctx.globalAlpha=chosen ? 1 : (source || cut) ? .9 : member ? .61 : .28;
        ctx.lineWidth=(chosen?1.55:1)/r;
        marker(ctx,x,y,(chosen?2.7:source?2.4:member?1.65:1.05)/r,colour);
        if(chosen||source||cut)marker(ctx,x,y,(chosen?6.6:4.1)/r,colour,true);
        if(labelled.has(id))labels.push({city,x:x*r,y:y*r,colour});
      }
      ctx.save();ctx.scale(1/r,1/r);
      ctx.font='12px sans-serif';ctx.textAlign='left';ctx.textBaseline='middle';ctx.globalAlpha=1;
      labels.sort((a,b)=>Number(b.city===inspected)-Number(a.city===inspected));
      const boxes=[];
      for(const label of labels){
        const {city,x,y,colour}=label,text=countryName(city,language),width=ctx.measureText(text).width;
        for(const [tx,ty] of [[x+9,y-11],[x+9,y+12],[x-9-width,y-11],[x-9-width,y+12]]){
          if(tx<-w/2 || tx+width>w/2 || ty<9-h/2 || ty>h/2-9 ||
             boxes.some(box=>tx<box.x+box.w+3 && tx+width>box.x-3 && Math.abs(ty-box.y)<14))continue;
          ctx.strokeStyle='#10191d';ctx.lineWidth=3.1;ctx.strokeText(text,tx,ty);
          ctx.fillStyle=colour;ctx.fillText(text,tx,ty);boxes.push({x:tx,y:ty,w:width});break;
        }
      }
      ctx.restore();
      ctx.restore();ctx.globalAlpha=1;
      showRegion();
    }
    function stop() {
      if(frame)cancelAnimationFrame(frame);
      frame=0;previous=null;
    }
    function running() {
      return ctx && active && visible && !document.hidden && !motion.matches && (cameraFlight || (!paused && (rotating || dispatch.length)));
    }
    function tick(now) {
      frame=0;
      if(!running())return;
      if(previous===null || now-previous>=1000/24){
        const dt=previous===null?0:Math.min((now-previous)/1000,.2);
        if(!paused)elapsed+=dt;
        if(cameraFlight){
          cameraFlight.progress=Math.min(1,cameraFlight.progress+dt/.58);
          const u=cameraFlight.progress,ease=u*u*(3-2*u);
          longitude=cameraFlight.lon+cameraFlight.dx*ease;
          latitude=cameraFlight.lat+cameraFlight.dy*ease;
          if(u===1)cameraFlight=null;
        }else if(rotating && !paused && !gesture){
          longitude=(longitude-dt*5.2+360)%360;
        }
        previous=now;paint();
      }
      frame=requestAnimationFrame(tick);
    }
    function refresh() {
      stop();
      if(active && visible && !document.hidden){
        paint();if(running())frame=requestAnimationFrame(tick);
      }
    }
    function globeRadius(w,h){return Math.min(w*.415,h*.438,365);}
    function currentLatitude(){return latitude??Math.asin(viewAt(longitude).tilt)/radians;}
    function centreOn(place,point=place) {
      const lat=currentLatitude(),dx=((point.lon-longitude)%360+540)%360-180;
      rotating=false;updateControls();
      if(motion.matches || !visible || document.hidden){
        longitude=point.lon;latitude=point.lat;cameraFlight=null;
      }else {
        latitude=lat;
        cameraFlight={lon:longitude,lat,dx,dy:point.lat-lat,progress:0};
      }
      showRegion();refresh();
    }
    function choosePlace(place) {
      if(!place)return;
      if(inspected!==place){inspected=place;rebuild();}
      centreOn(place);
    }
    function changeRegion(step) {
      const index=Math.max(0,cameraOrder.indexOf(inspected));
      choosePlace(cameraOrder[(index+step+cameraOrder.length)%cameraOrder.length]);
    }
    back.addEventListener('click',()=>changeRegion(-1));forward.addEventListener('click',()=>changeRegion(1));
    toggle.addEventListener('click',()=>{paused=!paused;rotating=!paused;updateControls();refresh();});
    function position(event){
      const rect=canvas.getBoundingClientRect(),r=globeRadius(rect.width,rect.height);
      return {x:(event.clientX-rect.left-rect.width/2)/r,y:(event.clientY-rect.top-rect.height/2)/r,r};
    }
    function pickPoint(x,y,r,touch=false){
      const v=viewAt(longitude,latitude),geo=window.GlobePicking.locationAt(x,y,v);
      if(!geo)return;
      const code=window.GlobePicking.countryAt(geo.lon,geo.lat);
      let hit=null,limit=touch?10:7;
      for(const city of countryPlaces){
        const [cx,cy,depth]=projected(v,...city.point),distance=Math.hypot(cx-x,cy-y)*r;
        // A tiny territory may have a city marker without a polygon at map scale.
        if(code && city.region!==code && (mappedRegions.has(city.region) || distance>(touch?5:3)))continue;
        if(depth>0 && distance<limit){hit=city;limit=distance;}
      }
      const place=hit||byCountry[code];
      if(place)choosePlace(place);
    }
    function beginPointer(event){
      if(gesture || !active || event.isPrimary===false || (event.button!=null && event.button!==0))return;
      const p=position(event);
      if(p.x*p.x+p.y*p.y>1)return;
      cameraFlight=null;
      gesture={id:event.pointerId,x:event.clientX,y:event.clientY,lon:longitude,lat:currentLatitude(),r:p.r,drag:false};
      canvas.setPointerCapture?.(event.pointerId);
    }
    function movePointer(event){
      if(!gesture || gesture.id!==event.pointerId)return;
      const dx=event.clientX-gesture.x,dy=event.clientY-gesture.y;
      if(!gesture.drag && Math.hypot(dx,dy)<5)return;
      if(!gesture.drag){rotating=false;updateControls();}
      gesture.drag=true;
      longitude=gesture.lon-dx/gesture.r/radians;
      latitude=Math.max(-89.5,Math.min(89.5,gesture.lat+dy/gesture.r/radians));
      canvas.classList.add('is-dragging');paint();
    }
    function endPointer(event){
      if(!gesture || gesture.id!==event.pointerId)return;
      if(event.type==='pointerup')movePointer(event);
      const tapped=!gesture.drag && event.type==='pointerup';
      gesture=null;canvas.classList.remove('is-dragging');
      if(canvas.hasPointerCapture?.(event.pointerId))canvas.releasePointerCapture(event.pointerId);
      if(tapped){
        const p=position(event);pickPoint(p.x,p.y,p.r,event.pointerType==='touch');
      }
    }
    function handleKey(event){
      if(!active || event.altKey || event.ctrlKey || event.metaKey)return;
      const step=event.shiftKey?30:12,angles={ArrowLeft:[-step,0],ArrowRight:[step,0],ArrowUp:[0,step],ArrowDown:[0,-step]};
      if(event.key==='Enter' || event.key===' '){
        event.preventDefault();event.stopPropagation();pickPoint(0,0,globeRadius(canvas.clientWidth,canvas.clientHeight));return;
      }
      if(!angles[event.key])return;
      event.preventDefault();event.stopPropagation();cameraFlight=null;rotating=false;updateControls();
      const [dx,dy]=angles[event.key];
      latitude=Math.max(-89.5,Math.min(89.5,currentLatitude()+dy));
      longitude+=dx;refresh();
    }
    function resetGesture(){
      if(gesture && canvas.hasPointerCapture?.(gesture.id))canvas.releasePointerCapture(gesture.id);
      gesture=null;canvas.classList.remove('is-dragging');
    }
    canvas.addEventListener('pointerdown',beginPointer);
    canvas.addEventListener('pointermove',movePointer);
    for(const name of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(name,endPointer);
    canvas.addEventListener('keydown',handleKey);
    const observer=typeof IntersectionObserver==='function'?new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;refresh();}):null;
    const resize=typeof ResizeObserver==='function'?new ResizeObserver(refresh):null;
    function setLocale(lang) {
      language=Object.hasOwn(copy,lang)?lang:'ko';
      const c=copy[language];
      const m=mapCopy[language];
      hint.textContent=m.hint;canvas.setAttribute('aria-label',c.scene);
      peerKey.textContent=m.peer;liveKey.textContent=m.live;cutKey.textContent=m.cut;
      host.lang=language;
      const names=new Intl.Collator(language);
      cameraOrder=countryPlaces.slice().sort((a,b)=>names.compare(countryName(a,language),countryName(b,language)));
      rebuild();updateControls();
      if(active && visible)paint();
    }
    function inView() {
      const rect=host.getBoundingClientRect();
      return rect.bottom>rect.top && rect.top<window.innerHeight && rect.bottom>0;
    }
    function checkScroll() {
      if(!active)return;
      const next=inView();
      if(next!==visible){visible=next;refresh();}
    }
    function show(lang='ko'){
      if(!active){
        elapsed=0;longitude=inspected.lon;latitude=inspected.lat;
        cameraFlight=null;resetGesture();
      }
      active=true;host.hidden=false;
      setLocale(lang);visible=inView();refresh();
    }
    function hide(){
      active=false;host.hidden=true;cameraFlight=null;resetGesture();panel.dismiss?.();stop();
    }
    function setPaused(value){
      if(paused!==Boolean(value)){paused=Boolean(value);updateControls();refresh();}
    }
    function motionChange(){
      if(motion.matches && cameraFlight){
        longitude=cameraFlight.lon+cameraFlight.dx;latitude=cameraFlight.lat+cameraFlight.dy;cameraFlight=null;
      }
      updateControls();refresh();
    }
    function destroy(){
      hide();panel.destroy?.();observer?.disconnect();resize?.disconnect();
      canvas.removeEventListener('pointerdown',beginPointer);
      canvas.removeEventListener('pointermove',movePointer);
      for(const name of ['pointerup','pointercancel','lostpointercapture'])canvas.removeEventListener(name,endPointer);
      canvas.removeEventListener('keydown',handleKey);
      window.removeEventListener('resize',refresh);
      if(!observer)window.removeEventListener('scroll',checkScroll,true);
      document.removeEventListener('visibilitychange',refresh);motion.removeEventListener?.('change',motionChange);
    }
    if(observer)observer.observe(host);
    else window.addEventListener('scroll',checkScroll,{capture:true,passive:true});
    resize?.observe(canvas);window.addEventListener('resize',refresh);
    document.addEventListener('visibilitychange',refresh);motion.addEventListener?.('change',motionChange);
    return {show,setLocale,setPaused,hide,destroy};
  }
  window.HorizonSky={mount};
})();
