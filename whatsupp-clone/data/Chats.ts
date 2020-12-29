export default {
  id: '1',
  users: [{
      id: 'u1',
      name: 'Thiago',
      imageUri: 'https://avatars2.githubusercontent.com/u/38446286?s=460&u=777a47871ada0fc9c70624f9e08470c86f21e6b0&v=4'
  }, {
      id: 'u2',
      name: 'Francisco',
      imageUri: 'https://avatars3.githubusercontent.com/u/49682654?s=460&u=8710685067b00112eb6fbffe1785fa1f3489a797&v=4'
  }],
  messages: [{
      id: 'm1',
      content: 'E aí Francisco!',
      createdAt: '2020-10-03T14:48:00.000Z',
      user: {
          id: 'u1',
          name: 'Thiago'
      }
  }, {
      id: 'm2',
      content: 'Beleza, e vc?',
      createdAt: '2020-10-03T14:49:00.000Z',
      user: {
          id: 'u2',
          name: 'Francisco'
      }
  }, {
    id: 'm3',
    content: 'Melhorou?',
    createdAt: '2020-10-03T14:49:00.000Z',
    user: {
        id: 'u1',
        name: 'Thiago'
    }
}, {
    id: 'm4',
    content: 'Melhorei cara, valeu aí!',
    createdAt: '2020-10-03T14:49:00.000Z',
    user: {
        id: 'u2',
        name: 'Francisco'
    }
}, {
    id: 'm5',
    content: 'E os devOps?',
    createdAt: '2020-10-03T14:49:00.000Z',
    user: {
        id: 'u1',
        name: 'Thiago'
    }
}, {
    id: 'm6',
    content: 'Nó cara, vai ter q esperar um pouco kkkk... Começar leve por enquanto',
    createdAt: '2020-10-03T14:49:00.000Z',
    user: {
        id: 'u2',
        name: 'Francisco'
    }
}, {
    id: 'm7',
    content: 'E vc, programando bastante?',
    createdAt: '2020-10-03T14:49:00.000Z',
    user: {
        id: 'u2',
        name: 'Francisco'
    }
}, {
    id: 'm8',
    content: 'To cara... Até que pra mim não foi ruim ter quarentena kkkkk',
    createdAt: '2020-10-03T14:49:00.000Z',
    user: {
        id: 'u1',
        name: 'Thiago'
    }
}]
}