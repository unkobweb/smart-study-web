import Index from './index.vue'

describe('<Index />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(Index, {
      props: {
        course: {
          uuid: '123',
          title: 'Course Title',
          price: 100,
          thumbnail: {
            url: null
          }
        },
        isTeacher: false
      }
    })
  })
})