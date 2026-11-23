window.TerritoryGuide = {
  ko: {
    open: '도록 열기',
    heading: '도록',
    close: '도록 닫기',
    notes: [
      ['입구', '말을 건넨 사람이 ‘온’, 그 일을 받아 함께 풀어 가는 AI가 ‘두루’다.'],
      ['대본 검토', '작가의 에이전트가 대본을 짚고, 감독은 문 앞에서 머뭇거리는 인물의 의도를 확인한다.'],
      ['캐스팅', '배우와 의상 디자이너가 인물의 색과 말투를 고른다. 배우가 정한 사용 범위도 이 장면에 함께 기록한다.'],
      ['대본 수정', '작가가 새 대사를 받아들인다. 대본과 촬영 현장에 보낼 장면표가 함께 바뀐다.'],
      ['촬영', '이 컷을 위해 미술·조명·촬영의 두루가 모여 장면표 위에서 문 위치, 빛의 방향, 카메라 자리를 맞춘다.'],
      ['새 의뢰', '감독이 이 컷의 발소리 작업을 허락한다. 음향실에는 이 의뢰용 가명과 합성 타이밍표가 간다.'],
      ['음향 작업', '음향실의 두루가 발을 딛는 순간을 찾아 소리를 맞춘다. 이 컷의 믹스를 편집실에 보내려면 받을 곳과 쓰임을 정해 다시 허락을 받는다.'],
      ['다음 스튜디오', '편집실은 허락된 화면과 소리를 잇는다. 새 의뢰가 오면 그 일을 맡을 두루들이 모인다.']
    ]
  },
  en: {
    open: 'Open catalogue',
    heading: 'Catalogue',
    close: 'Close the catalogue',
    notes: [
      ['Entry', 'The person who speaks is On. The AI agents who take up the task together are the Duru.'],
      ['Script review', 'The writer’s agent brings up the passage. The director checks why the character hesitates at the door.'],
      ['Casting', 'The actor and costume designer try a colour and a voice for the character. The record links the actor’s permission to this scene.'],
      ['Script revision', 'The writer accepts the new line. The script and the shot notes for the shoot change together.'],
      ['On set', 'Set design, lighting and camera agents gather for this shot and use its notes to align the door, the light and the camera position.'],
      ['New commission', 'The director clears this shot for footstep work. The sound studio receives a request-specific alias and a synthetic timing sheet.'],
      ['Sound work', 'The sound studio syncs the footsteps. A new permission names the editing studio and allows it to use the mix for this shot.'],
      ['Next studio', 'The editor joins the cleared picture and sound. When a new commission arrives, the agents needed for it gather.']
    ]
  },
  es: {
    open: 'Abrir el catálogo',
    heading: 'Catálogo',
    close: 'Cerrar el catálogo',
    notes: [
      ['Entrada', 'Quien toma la palabra es On. Los agentes de IA que se reúnen para atender su encargo son los Duru.'],
      ['Lectura del guion', 'El agente del guionista localiza el pasaje. La directora comprueba por qué el personaje duda ante la puerta.'],
      ['Reparto', 'La actriz y la diseñadora de vestuario prueban un color y una voz para el personaje. El permiso de la actriz queda vinculado a esta escena.'],
      ['Revisión del guion', 'El guionista acepta la nueva frase. Cambian a la vez el guion y las indicaciones de rodaje.'],
      ['Rodaje', 'Para este plano se reúnen agentes de decorado, iluminación y cámara que consultan las mismas indicaciones para situar la puerta, la luz y la cámara.'],
      ['Nuevo encargo', 'La directora autoriza los pasos de este plano. El estudio de sonido recibe un seudónimo exclusivo del encargo y una hoja de tiempos sintética.'],
      ['Sonido', 'Sonido sincroniza los pasos. Un nuevo permiso identifica el estudio de montaje y autoriza la mezcla para este plano.'],
      ['Siguiente estudio', 'Montaje enlaza la imagen y el sonido autorizados. Cuando llega otro encargo, se reúnen los agentes que hacen falta.']
    ]
  }
};

window.CaseGuideText = {
  ko: {
    intent: '한 사람이 건넨 말이 여러 DURU를 거쳐 그 사람에게 돌아옵니다. 내 자료의 주인은 나이고, 누구에게 무엇을 맡길지도 내가 정합니다.',
    legend: 'ON은 사람, DURU는 Agent입니다.',
    philosophyTitle: '온두루의 철학',
    philosophy: '온이 서울에서 정한 부탁과 허락은 모델을 바꿔도 이어집니다. 나라들은 협약을 맺어 파운더리에서 운영하는 모델과 연산 자원을 나눕니다. 자체 모델이 없는 공동체도 자기 언어로 도움을 청하고 돌아온 답을 살필 수 있습니다. 어느 공급자가 멈추면 다른 나라의 두루들이 일을 나눠 맡고 온에게 결과를 돌려줍니다.',
    horizon: '온두루가 꿈꾸는 저 너머에는 아직 태어나지 않은 사람의 자리도 있습니다. 다음 세대가 저마다 물려받은 말로 이야기를 짓고 다른 생명과 터전을 나눌 수 있기를 바랍니다.',
    sourceNote: '온두루는 유네스코 헌장 서문이 밝힌 인간의 존엄과 지적·도덕적 연대를 사람과 에이전트가 함께 일하는 기준으로 삼습니다.',
    sourceLink: '헌장 서문 읽기',
    geographyNote: '지명과 좌표는 GeoNames와 Natural Earth 자료를 따릅니다. 각 나라와 지역은 지도에 대표 지점 하나로 표시합니다. 파운더리 보유 여부, 공유 협약과 공급 중단은 전시에서 설정한 조건입니다.',
    flowTitle: '한 요청이 영토를 지나는 길',
    beats: ['사람의 부탁', '권한 확인', '외부에 질문', '내부 재검증', '사람에게 답'],
    flowKeys: {
      governance: '사람이 일의 목적을 정합니다.',
      method: '부탁이 바뀌면 함께할 에이전트도 달라집니다.',
      constitution: '각 단계에서 권한을 확인합니다.',
      ledger: '온의 결정, 두루가 낸 이견, 정정의 근거를 잇습니다.'
    },
    principles: {
      governance: ['Governance', '누구를 위해 움직이는가', '사람은 서로 다른 회사의 에이전트 중에서 자기 일에 맞는 에이전트를 고릅니다. 모델을 바꾸어도 개인의 자료와 그 쓰임을 정할 권리는 사람에게 남습니다. 가령 큰 모델을 가진 나라만 초대했다면, 두루는 빠진 공동체와 그 이유를 짚어 이의를 낼 수 있습니다. 온은 그 근거를 듣고 결정을 유지하거나 고치거나 거둡니다. 처음 결정과 이의, 온이 답한 까닭이 함께 남습니다.'],
      method: ['Methodology', '밖에 무엇을 묻고, 안에서 무엇을 확인할까', '서로 다른 회사의 에이전트들이 부탁의 뜻을 읽고, 다른 회사에 물어도 될 질문을 새로 만듭니다. 밖에서 돌아온 답은 하나의 제안입니다. 영토 안의 에이전트가 근거를 확인한 뒤 사람에게 전합니다.'],
      constitution: ['Constitution & Rules', '다른 영토의 문을 열 때', '헌법은 자기 자료를 누가, 어떤 목적으로, 얼마 동안 쓸지 사람이 정할 권리를 담습니다. 규정은 이 권리를 각 단계에서 지키는 절차입니다. 두 영토의 허락이 다르면 그 지점에서 멈춰 결정권을 가진 사람에게 다시 묻습니다.'],
      ledger: ['Ledger', '처음의 부탁에서 정정까지', '원장에는 요청의 뜻, 허락의 범위, 일을 수행한 에이전트, 판단의 근거와 고친 이유를 차례로 남깁니다. 개인의 자료는 맡은 곳에 둡니다. 권한 있는 검토자는 기록을 거슬러 누가 어디에서 무엇을 결정했는지 확인할 수 있습니다. 모델이 바뀌어 오늘의 답이 어제와 다르면, 온은 당시의 기록을 펴고 두루에게 묻습니다. “내가 맡긴 일은 같은데, 왜 답이 달라졌을까?” 답을 고쳐 받을지, 일을 멈출지는 온이 정합니다.']
    },
    methodSteps: [
      ['이름은 안에서 확인합니다.', '실명과 원본은 맡은 곳에 둡니다. 다른 영토에는 이번 부탁에만 쓰는 가명과 합의한 목적을 전합니다. 실명과 가명을 잇는 표는 안에 남습니다.'],
      ['밖에는 필요한 조건만 건넵니다.', '허락된 조건만으로 처음부터 합성 사례를 만들고, 식별자가 남지 않았는지 점검합니다. 받은 자료를 모델 학습에 쓰려면 자료 주인의 별도 허락이 필요합니다.'],
      ['돌아온 제안은 안에서 다시 시험합니다.', '제안을 처음 부탁과 자료에 비춰 봅니다. 어긋나면 질문을 고쳐 다시 시뮬레이션하고, 틀린 판단과 고친 이유를 원장에 남깁니다.']
    ]
  },
  en: {
    intent: 'A person speaks. Their request passes through several DURU and comes back as an answer. My data belongs to me. I decide what to entrust to whom.',
    legend: 'ON is the person. DURU is the Agent.',
    philosophyTitle: 'The philosophy of ONDURU',
    philosophy: 'On can entrust a task to Duru in Seoul and keep the same purpose and permissions when a model changes. Countries can agree to share the models they operate and the computing power to run them. Communities can ask in their own language and review the answer even if they have no model of their own. When a supplier withdraws, Duru in partner countries share the work and return the result to On.',
    horizon: 'The future ONDURU imagines has room for people yet to be born. May they tell their own stories in the languages they inherit and share their home with other forms of life.',
    sourceNote: 'The preamble to the UNESCO Constitution affirms human dignity and intellectual and moral solidarity. ONDURU draws on these values to guide how people and agents work together.',
    sourceLink: 'Read the preamble',
    geographyNote: 'Place names and coordinates are adapted from GeoNames and Natural Earth. Each country or territory has one point on the globe. Foundry capacity, sharing agreements and supply cutoffs are assumptions for this exhibition.',
    flowTitle: 'How a request travels through a territory',
    beats: ['Request', 'Permission', 'Ask outside', 'Check inside', 'Reply'],
    flowKeys: {
      governance: 'The person sets the purpose.',
      method: 'As the request changes, different agents gather.',
      constitution: 'Check authority at every step.',
      ledger: 'Link On’s decision, Duru’s objections and the grounds for a correction.'
    },
    principles: {
      governance: ['Governance', 'Whom does the work serve?', 'People choose agents from different providers to suit their task. When they change models, their personal data and the right to decide how it is used stay with them. If only countries with large models have been invited, Duru can name the communities left out and explain why their absence matters. On decides whether to keep, change or withdraw the invitation. The first decision, the objection and On’s grounds are kept together.'],
      method: ['Methodology', 'What can go out, and what must be checked inside?', 'Agents from different providers interpret the request and frame a question they have permission to send. An outside model returns a proposal. Agents inside the territory check its grounds before taking it back to the person who asked.'],
      constitution: ['Constitution and rules', 'When another territory opens its door', 'The constitution gives people the right to set who may use their data, for what purpose and for how long. Operating rules turn that right into checks at each step. Where two territories grant different permissions, agents pause at the boundary and ask the person with authority to decide.'],
      ledger: ['Ledger', 'From the first request to a correction', 'The ledger links the intent, the permission, the agent who acted, the grounds for its judgment and the reason for any correction. Personal data stays with its custodian. An authorised reviewer can follow that record to see who made each decision. If a new model gives a different answer today, On can open yesterday’s record and ask Duru, “I asked for the same thing. What changed your answer?” On decides whether to ask for a correction or stop the work.']
    },
    methodSteps: [
      ['Check identity inside.', 'Real names and original records stay with their custodian. The receiving territory gets a pseudonym used only for this request and the agreed purpose. The custodian keeps the link to the real name.'],
      ['Send only the conditions needed.', 'Agents build a synthetic case from scratch, using only the authorised conditions, and check that no identifier remains. A recipient needs separate permission from the data owner to use the material for model training.'],
      ['Test the returned proposal inside.', 'Agents compare the reply with the original request and its evidence. If they diverge, the agents revise the question, simulate it again and record the mistaken judgment and its correction.']
    ]
  },
  es: {
    intent: 'Una persona toma la palabra. Su petición pasa por varios DURU y vuelve a ella como respuesta. Mis datos me pertenecen. Yo decido qué confío a quién.',
    legend: 'ON es la persona. DURU es el agente (Agent).',
    philosophyTitle: 'La filosofía de ONDURU',
    philosophy: 'On puede confiar un encargo a Duru en Seúl y conservar su propósito y sus permisos al cambiar de modelo. Los países pueden acordar compartir los modelos que operan y los recursos para ejecutarlos. Incluso una comunidad sin modelo propio puede pedir ayuda en su lengua y revisar la respuesta. Si un proveedor se retira, los Duru de los países socios se reparten el trabajo y devuelven el resultado a On.',
    horizon: 'En el porvenir que imagina ONDURU hay un lugar para quienes aún no han nacido. Ojalá cuenten sus propias historias en las lenguas que hereden y compartan su hogar con otros seres vivos.',
    sourceNote: 'El preámbulo de la Constitución de la UNESCO afirma la dignidad humana y la solidaridad intelectual y moral. ONDURU toma estos valores como guía para el trabajo compartido entre personas y agentes.',
    sourceLink: 'Leer el preámbulo',
    geographyNote: 'Los nombres y las coordenadas proceden de GeoNames y Natural Earth. Un punto representa a cada país o territorio en el globo. La capacidad de cada país para operar modelos, los acuerdos de uso compartido y los cortes de suministro son supuestos de la exposición.',
    flowTitle: 'Cómo recorre una petición el territorio',
    beats: ['Petición', 'Permiso', 'Consulta', 'Revisión', 'Respuesta'],
    flowKeys: {
      governance: 'La persona decide el propósito.',
      method: 'Al cambiar el encargo, se reúnen otros agentes.',
      constitution: 'Se comprueba la autoridad en cada paso.',
      ledger: 'Se enlazan la decisión de On, las objeciones de Duru y las razones de cada rectificación.'
    },
    principles: {
      governance: ['Gobernanza', '¿A quién sirve el trabajo?', 'Cada persona elige entre agentes de distintas empresas los que necesita para su tarea. Aunque cambie de modelo, conserva sus datos personales y el derecho a decidir su uso. Si solo se ha invitado a países con modelos grandes, Duru puede señalar qué comunidades quedaron fuera y explicar por qué importa su ausencia. On decide si mantiene, cambia o retira la invitación. Se conservan juntos la primera decisión, la objeción y los motivos de On.'],
      method: ['Metodología', '¿Qué se pregunta fuera y qué se comprueba dentro?', 'Agentes de distintas empresas interpretan la petición y formulan una pregunta que tienen permiso para enviar. El modelo externo devuelve una propuesta. Los agentes del territorio comprueban su fundamento antes de responder a la persona.'],
      constitution: ['Constitución y reglas', 'Al abrir la puerta de otro territorio', 'La constitución reconoce el derecho a decidir quién usa los datos personales, para qué y por cuánto tiempo. Las reglas operativas concretan ese derecho en cada paso. Cuando difieren los permisos de dos territorios, los agentes se detienen en el límite y consultan a la persona facultada para decidir.'],
      ledger: ['Registro', 'De la primera petición a la rectificación', 'El registro enlaza la intención, el permiso, el agente que actuó, los motivos de su decisión y las correcciones. Los datos personales quedan bajo su custodia original. Quien tiene autorización para revisar el caso puede reconstruir quién decidió en cada paso. Si el nuevo modelo responde hoy de otro modo, On puede abrir el registro de ayer y preguntar a Duru por qué cambió su respuesta a la misma petición. On decide si pide una corrección o detiene el trabajo.']
    },
    methodSteps: [
      ['Comprobar la identidad dentro.', 'Los nombres reales y los originales quedan bajo su custodia inicial. El territorio receptor recibe la finalidad acordada y un seudónimo exclusivo de esa solicitud. La correspondencia con el nombre real queda dentro.'],
      ['Enviar solo las condiciones necesarias.', 'Los agentes construyen desde cero un caso sintético, solo con las condiciones autorizadas, y comprueban que no quede ningún identificador. Entrenar un modelo con el material recibido exige otro permiso de su titular.'],
      ['Probar dentro la propuesta recibida.', 'Los agentes contrastan la respuesta con la petición y las pruebas. Si hay discrepancias, reformulan la pregunta, repiten la simulación y registran el error y el motivo de la corrección.']
    ]
  }
};
