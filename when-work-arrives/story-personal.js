(() => {
  'use strict';

  const stories = window.ExhibitStories ||= {};
  const words = (ko, en, es) => ({ko, en, es});
  const role = (id, kind, art, x, y, label) => ({id, kind, art, x, y, label});
  const flow = (from, to, kind = 'request', label) => ({from, to, kind, label});
  const frame = (title, caption, nodes, edges) => ({title, caption, nodes, edges});
  const option = (id, label, scene) => ({id, label, result: scene.caption, stage: scene});

  const on = role('on', 'on', 'person', .12, .53, words('온', 'On', 'On'));
  const wardrobe = role('wardrobe', 'gate', 'wardrobe', .42, .50, words('내 옷장', 'My wardrobe', 'Mi armario'));
  const forecast = role('forecast', 'work', 'forecast', .76, .21, words('오후 날씨', 'Weather', 'Tiempo'));
  const calendar = role('calendar', 'source', 'calendar', .76, .70, words('내 일정', 'My calendar', 'Mi agenda'));
  const shop = role('shop', 'ally', 'shop', .80, .46, words('동네 매장', 'Local shop', 'Tienda local'));

  stories.personal = {
    label: words('비 오는 날의 옷장', 'A rainy-day wardrobe', 'Un armario para la lluvia'),
    stages: [
      frame(
        words('“비가 와도 자주색 스카프를 하고 싶어요.”', '“I’d like to wear my plum scarf, even in the rain.”', '«Quiero ponerme mi pañuelo color ciruela aunque llueva».'),
        words('온은 한 가지 더 부탁합니다. “가방에 달 펜던트도 찾아 줘요. 오늘 받을 수 있는지도요.”', 'On adds, “Find me a charm for my bag, too. See whether I can get one today.”', 'On añade: «Búscame también un colgante para el bolso. Mira si puedo conseguirlo hoy».'),
        [on, wardrobe], [flow('on', 'wardrobe')]
      ),
      frame(
        words('날씨와 약속이 내 옷장 앞에서 만납니다.', 'The forecast and my plans meet at my wardrobe.', 'El tiempo y mis planes se encuentran en el armario.'),
        words('날씨 두루는 오후 비를 알리고, 내 일정은 걸어갈 시간을 짚어 줍니다. 옷장 두루가 가진 옷에서 조합을 찾습니다.', 'The weather Duru brings the afternoon forecast. The calendar shows when On will be walking. The wardrobe Duru works with the clothes already there.', 'El Duru del tiempo trae el pronóstico y la agenda indica cuándo irá a pie. El Duru del armario combina las prendas que On ya tiene.'),
        [on, wardrobe, forecast, calendar], [flow('forecast', 'wardrobe', 'reply', words('오후 비', 'Afternoon rain', 'Lluvia por la tarde')), flow('calendar', 'wardrobe', 'internal')]
      ),
      frame(
        words('매장에는 짧은 질문 하나가 갑니다.', 'One small question reaches the shop.', 'A la tienda llega una sola pregunta.'),
        words('“가방 펜던트를 오늘 받을 수 있나요?” 옷장 사진과 약속 장소는 내게 남고, 매장은 품목과 받을 날만 봅니다.', '“Could I get a bag charm today?” The shop sees the item and pickup day. The wardrobe photos and meeting place stay with On.', '«¿Podría recoger hoy un colgante para el bolso?». La tienda ve el artículo y el día. Las fotos y el lugar de la cita quedan con On.'),
        [on, wardrobe, shop], [flow('wardrobe', 'shop', 'request', words('품목·수령일', 'Item · pickup day', 'Artículo · recogida')), flow('shop', 'wardrobe', 'reply')]
      ),
      frame(
        words('두 차림이 내게 돌아옵니다.', 'Two choices come back to me.', 'Dos opciones vuelven a mí.'),
        words('회색 니트에 자주색 스카프와 내 비옷. 매장은 가방 펜던트를 오늘 받을 수 있다고 답합니다. 펜던트도 챙길지는 온이 정합니다.', 'A grey knit, the plum scarf and On’s raincoat. The shop has a bag charm for pickup today. On decides whether to add it.', 'Un jersey gris, el pañuelo ciruela y el impermeable de On. La tienda tiene un colgante para recoger hoy. On decide si lo añade.'),
        [on, wardrobe, shop], [flow('wardrobe', 'on', 'reply'), flow('shop', 'on', 'reply', words('오늘 수령', 'Pickup today', 'Recogida hoy'))]
      )
    ],
    choices: [
      option('owned', words('가진 것으로 입기', 'Wear what I own', 'Usar lo que tengo'), frame(
        words('“오늘은 내 비옷을 걸칠게요.”', '“I’ll wear my own raincoat today.”', '«Hoy me pondré mi impermeable».'),
        words('온이 옷장에서 비옷과 스카프를 꺼냅니다. 매장과의 대화는 재고 문의에서 끝납니다.', 'On takes out the raincoat and the scarf. The conversation with the shop ends at the stock enquiry.', 'On saca el impermeable y el pañuelo. La conversación con la tienda termina con la consulta de existencias.'),
        [on, wardrobe], [flow('wardrobe', 'on', 'reply')]
      )),
      option('cover', words('펜던트를 더 살펴보기', 'Look at the charm', 'Ver el colgante'), frame(
        words('“펜던트는 얼마인지 물어봐 줘요.”', '“Ask how much the charm costs.”', '«Pregunta cuánto cuesta el colgante».'),
        words('온이 허락한 가격 문의만 매장에 닿습니다. 구입은 가격을 들은 뒤 온이 정합니다.', 'Only the price enquiry goes to the shop. On can decide whether to buy after hearing back.', 'Solo se envía la consulta del precio. On decidirá si compra al recibir la respuesta.'),
        [on, wardrobe, shop], [flow('on', 'wardrobe'), flow('wardrobe', 'shop'), flow('shop', 'on', 'reply')]
      ))
    ]
  };
})();
