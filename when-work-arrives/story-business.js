(() => {
  'use strict';

  const stories = window.ExhibitStories ||= {};
  const words = (ko, en, es) => ({ko, en, es});
  const role = (id, kind, art, x, y, label) => ({id, kind, art, x, y, label});
  const flow = (from, to, kind = 'request', label) => ({from, to, kind, label});
  const frame = (title, caption, nodes, edges) => ({title, caption, nodes, edges});
  const option = (id, label, scene) => ({id, label, result: scene.caption, stage: scene});

  const on = role('on', 'on', 'person', .13, .50, words('온', 'On', 'On'));
  const portal = role('portal', 'gate', 'letter', .37, .25, words('그룹 창구', 'Group portal', 'Portal del grupo'));
  const affiliate = role('affiliate', 'ally', 'seal', .65, .25, words('근무한 계열사', 'Former employer', 'Empresa de origen'));
  const hr = role('hr', 'source', 'archive', .85, .54, words('인사 원장', 'HR records', 'Archivo laboral'));
  const synthesis = role('synthesis', 'work', 'letter', .37, .75, words('가상 요청', 'Fictional request', 'Petición ficticia'));
  const company = role('foundry', 'gate', 'work', .69, .75, words('회사 파운더리', 'Company foundry', 'Modelo interno'));
  const publicDesk = role('public', 'gate', 'letter', .37, .25, words('공공 창구', 'Public portal', 'Portal público'));

  stories.documents = {
    label: words('서류 발급', 'Documents', 'Documentos'),
    stages: [
      frame(
        words('“경력증명서와 퇴직증명서를 받고 싶어요.”', '“I need proof of my work and when I left.”', '«Necesito acreditar mi experiencia y cuándo dejé el puesto».'),
        words('온은 두 장의 서류를 골라 전 직장의 창구에 맡깁니다. 받을 사람은 온입니다.', 'On asks the former employer’s portal for two documents and chooses to receive them personally.', 'On pide dos documentos en el portal de su antigua empresa y elige recibirlos personalmente.'),
        [on, portal], [flow('on', 'portal')]
      ),
      frame(
        words('내가 일했던 곳이 나를 확인합니다.', 'The employer who knew me checks my identity.', 'La empresa en la que trabajé comprueba mi identidad.'),
        words('그룹 창구는 요청 가명과 서류 종류를 보냅니다. 계열사는 자기 인사 원장에서 본인을 확인합니다.', 'The group portal passes a request alias and the document types. The employing affiliate checks its own HR records.', 'El portal transmite un alias y los tipos de documento. La filial comprueba la identidad en su archivo laboral.'),
        [on, portal, affiliate, hr], [flow('portal', 'affiliate', 'request', words('가명·서류 종류', 'Alias · document types', 'Alias · documentos')), flow('affiliate', 'hr', 'internal')]
      ),
      frame(
        words('증명서는 온에게, 가상 요청은 회사 안에.', 'On receives the documents. The company tests a fictional request.', 'On recibe los documentos. La empresa ensaya con una petición ficticia.'),
        words('계열사는 확인한 두 장을 온에게 보냅니다. 회사 파운더리는 따로 만든 가상 요청으로 안내 절차를 시험합니다.', 'The affiliate sends the two verified documents to On. The company’s local foundry tests its service with a separately written fictional request.', 'La filial envía los documentos verificados a On. El modelo local de la empresa prueba la atención con una petición ficticia creada aparte.'),
        [on, affiliate, synthesis, company], [flow('affiliate', 'on', 'reply', words('증명서 두 장', 'Two certificates', 'Dos certificados')), flow('synthesis', 'foundry', 'internal', words('합성 요청', 'Synthetic request', 'Petición sintética'))]
      ),
      frame(
        words('“두 장 모두 제가 받았어요.”', '“Both documents came back to me.”', '«Los dos documentos me llegaron a mí».'),
        words('인사 원장은 회사 안에 남습니다. 온두루의 기록에는 무엇을 허락했고 누가 받았는지가 남습니다.', 'The HR records stay with the employer. Onduru records what On allowed and who received the documents.', 'El archivo laboral queda en la empresa. Onduru registra qué autorizó On y quién recibió los documentos.'),
        [on, affiliate, hr], [flow('affiliate', 'on', 'reply')]
      )
    ],
    choices: [
      option('keep', words('내가 보관하기', 'Keep my copies', 'Guardar mis copias'), frame(
        words('“다음에 쓸 때는 제가 정할게요.”', '“I’ll decide when to use them.”', '«Yo decidiré cuándo usarlos».'),
        words('두 장은 온에게 머뭅니다. 다른 사람에게 건네는 일은 온이 새로 정합니다.', 'The copies stay with On. On can name another recipient later.', 'Las copias quedan con On, que podrá elegir otro destinatario más adelante.'),
        [on, affiliate], []
      )),
      option('public', words('공공 창구로도 보기', 'See the public route', 'Ver la vía pública'), frame(
        words('같은 부탁이 공공 창구에 닿으면', 'When the same request reaches a public portal', 'Cuando la misma petición llega al portal público'),
        words('공공의 두루가 요청을 발급처에 잇습니다. 서류를 확인하고 온에게 보내는 곳은 근무한 계열사입니다.', 'The public Duru routes the request to the issuer. The employing affiliate verifies the documents and sends them to On.', 'El Duru público dirige la petición al emisor. La filial comprueba los documentos y se los envía a On.'),
        [on, publicDesk, affiliate], [flow('on', 'public'), flow('public', 'affiliate'), flow('affiliate', 'on', 'reply')]
      ))
    ]
  };

  const civic = role('foundry', 'gate', 'work', .43, .50, words('지역 파운더리', 'Local foundry', 'Modelo local'));
  const housing = role('housing', 'ally', 'home', .80, .24, words('주거 상담', 'Housing advice', 'Vivienda'));
  const work = role('work', 'work', 'work', .80, .71, words('구직 상담', 'Job advice', 'Empleo'));
  stories.counsel = {
    label: words('생활·구직 상담', 'Housing and work', 'Vivienda y empleo'),
    stages: [
      frame(
        words('“다음 달부터 다시 일할 수 있어요.”', '“I can work again next month.”', '«El mes que viene podré volver a trabajar».'),
        words('“그런데 이번 달 방세가 먼저 걱정돼요.”', '“But right now I’m worried about this month’s rent.”', '«Pero ahora me preocupa el alquiler de este mes».'),
        [on, civic], [flow('on', 'foundry')]
      ),
      frame(
        words('“방세부터 살펴볼까요?”', '“Shall we start with the rent?”', '«¿Empezamos por el alquiler?»'),
        words('지역의 두루가 되묻습니다. 온이 답합니다. “네. 다음 달 일자리도 함께 알아봐 주세요.”', 'The local Duru checks what matters most. “Yes,” says On. “And please look into work for next month too.”', 'El Duru local pregunta qué urge más. «Sí —dice On—. Mirad también el trabajo del mes que viene».'),
        [on, civic], [flow('foundry', 'on', 'reply'), flow('on', 'foundry')]
      ),
      frame(
        words('각자 필요한 말만 건네받습니다.', 'Each Duru gets the part it needs.', 'Cada Duru recibe solo lo que necesita.'),
        words('공공 파운더리는 주거 쪽에 ‘이번 달 방세’, 구직 쪽에 ‘다음 달 근무 가능’을 전합니다. 이름은 이곳에 머뭅니다.', 'The public foundry sends “rent this month” to housing and “available next month” to employment. On’s name stays here.', 'El modelo del servicio público envía «alquiler de este mes» a vivienda y «disponible el mes que viene» a empleo. El nombre queda aquí.'),
        [on, civic, housing, work], [flow('foundry', 'housing', 'request', words('이번 달 방세', 'Rent this month', 'Alquiler este mes')), flow('foundry', 'work', 'request', words('다음 달 근무', 'Available next month', 'Disponible próximo mes'))]
      ),
      frame(
        words('“주거 상담부터 받고 싶어요.”', '“I’d like to start with housing.”', '«Quiero empezar por vivienda».'),
        words('주거 쪽은 방세를 상담할 창구를, 구직 쪽은 다음 달 근무 시간을 정리할 질문을 보내옵니다. 온이 먼저 만날 곳을 고릅니다.', 'Housing sends a rent counselling contact. Employment asks what hours On can work next month. On chooses whom to speak with first.', 'Vivienda envía un contacto para consultas de alquiler. Empleo pregunta por el horario del próximo mes. On elige con quién hablar primero.'),
        [on, civic, housing, work], [flow('housing', 'foundry', 'reply'), flow('work', 'foundry', 'reply'), flow('foundry', 'on', 'reply')]
      )
    ],
    choices: [
      option('direct-housing', words('주거 쪽과 직접 이야기하기', 'Speak to housing directly', 'Hablar con vivienda'), frame(
        words('온이 직접 이야기를 잇습니다.', 'On takes up the conversation.', 'On continúa la conversación.'),
        words('온이 주거 창구를 고릅니다. 어떤 사정을 더 말할지는 온에게 달려 있습니다.', 'On chooses the housing contact and decides what else to share.', 'On elige el contacto de vivienda y decide qué más quiere contar.'),
        [on, housing], [flow('on', 'housing'), flow('housing', 'on', 'reply')]
      )),
      option('via-duru', words('두루와 구직 상담 준비하기', 'Prepare with Duru', 'Preparar la consulta con Duru'), frame(
        words('“오전에 일할 수 있다고 전해 주세요.”', '“Tell them I can work mornings.”', '«Diles que puedo trabajar por las mañanas».'),
        words('두루가 온이 고른 근무 시간만 구직 창구에 건넵니다. 방세 이야기는 이 길로 가지 않습니다.', 'Duru passes the chosen work hours to the employment contact. The rent conversation stays behind.', 'Duru comunica al servicio de empleo el horario elegido. La conversación sobre el alquiler queda aparte.'),
        [on, civic, work], [flow('on', 'foundry'), flow('foundry', 'work'), flow('work', 'on', 'reply')]
      ))
    ]
  };

  const business = role('foundry', 'gate', 'archive', .43, .50, words('회사 파운더리', 'Company foundry', 'Modelo interno'));
  const purchasing = role('purchasing', 'ally', 'contract', .80, .24, words('구매', 'Purchasing', 'Compras'));
  const operations = role('operations', 'work', 'parcel', .80, .71, words('운영', 'Operations', 'Operaciones'));
  stories.cost = {
    label: words('비용 검토', 'Costs and jobs', 'Costes y empleo'),
    stages: [
      frame(
        words('“비용을 줄이려면 몇 명을 줄여야 할까요?”', '“How many jobs would we have to cut?”', '«¿Cuántos puestos habría que recortar para reducir los costes?»'),
        words('두루가 묻습니다. “사람을 지키면서 줄일 수 있는 비용도 함께 살펴볼까요?” 온이 고개를 끄덕입니다.', 'Duru asks, “Shall we also look for savings that keep people in work?” On agrees.', 'Duru pregunta: «¿Buscamos también un ahorro que conserve los puestos?». On acepta.'),
        [on, business], [flow('on', 'foundry'), flow('foundry', 'on', 'reply')]
      ),
      frame(
        words('이름은 회사 안에, 가정은 함께.', 'The names stay inside. The scenarios can travel.', 'Los nombres quedan dentro. Los escenarios se comparten.'),
        words('회사 파운더리가 합성 주문량과 가상 인원 규모를 만듭니다. 구매와 운영은 이 조건으로 각자의 안을 살핍니다.', 'The company foundry creates fictional order volumes and staffing levels. Purchasing and operations use them to explore alternatives.', 'El modelo interno crea volúmenes de pedidos y plantillas ficticios. Compras y operaciones estudian opciones con esos datos.'),
        [on, business, purchasing, operations], [flow('foundry', 'purchasing', 'request', words('합성 주문량', 'Fictional orders', 'Pedidos ficticios')), flow('foundry', 'operations', 'request', words('가상 교대조', 'Fictional shifts', 'Turnos ficticios'))]
      ),
      frame(
        words('누가 이 비용을 감당하게 될까요?', 'Who would bear the cost?', '¿Quién asumiría el coste?'),
        words('구매는 겹치는 구독 계약을 찾아냅니다. 운영은 한 교대조를 줄이면 야간 출고가 밀린다는 결과를 돌려줍니다.', 'Purchasing finds overlapping subscriptions. Operations finds that cutting one shift would delay night dispatches in the simulation.', 'Compras encuentra suscripciones duplicadas. En la simulación de operaciones, quitar un turno retrasa las expediciones nocturnas.'),
        [on, business, purchasing, operations], [flow('purchasing', 'foundry', 'reply', words('중복 구독', 'Duplicate subscriptions', 'Suscripciones duplicadas')), flow('operations', 'foundry', 'reply', words('야간 출고 지연', 'Late dispatch', 'Envíos retrasados'))]
      ),
      frame(
        words('“계약부터 다시 보겠습니다.”', '“Let’s look at the contract first.”', '«Revisemos primero el contrato».'),
        words('두 안이 온에게 돌아옵니다. 온의 선택과 그 까닭이 기록에 남고, 사람에게 영향을 줄 결정은 온이 맡습니다.', 'Both proposals return to On. The record keeps On’s choice and reason. On is responsible for decisions affecting people.', 'Las dos propuestas vuelven a On. El registro conserva la elección y el motivo. On responde de las decisiones que afectan a las personas.'),
        [on, business], [flow('foundry', 'on', 'reply')]
      )
    ],
    choices: [
      option('terms', words('계약 조정안 살피기', 'Explore contract changes', 'Explorar el contrato'), frame(
        words('“다음 갱신 때 바꿀 조건을 알려 주세요.”', '“Which terms can we change at renewal?”', '«¿Qué condiciones podríamos cambiar al renovar?»'),
        words('구매 두루가 조정할 항목을 정리해 온에게 돌려줍니다. 계약 체결은 별도 결정입니다.', 'The purchasing Duru brings back terms for review. Signing a contract requires a separate decision.', 'El Duru de compras devuelve las condiciones que se pueden revisar. Firmar requiere otra decisión.'),
        [on, business, purchasing], [flow('on', 'foundry'), flow('foundry', 'purchasing'), flow('purchasing', 'on', 'reply')]
      )),
      option('burden', words('동료에게 미칠 영향 살피기', 'Explore the workload', 'Explorar la carga laboral'), frame(
        words('“누구에게 일이 몰리는지 먼저 봅시다.”', '“Let’s see where the work would pile up.”', '«Veamos dónde se acumularía el trabajo».'),
        words('운영 두루가 가상의 교대조로 업무량과 납기를 다시 살핍니다. 개인별 명단은 건네지 않습니다.', 'The operations Duru tests workload and delivery times with fictional shifts. The original staff list stays inside.', 'El Duru de operaciones ensaya cargas y plazos con turnos ficticios. La lista del personal queda dentro.'),
        [on, business, operations], [flow('on', 'foundry'), flow('foundry', 'operations'), flow('operations', 'on', 'reply')]
      ))
    ]
  };
})();
