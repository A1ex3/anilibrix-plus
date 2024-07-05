export default [
    {
      name: 'schedule',
      path: '/schedule',
      meta: { layout: { show_scroll: true } },
      props: true,
      component: () => import('@views/schedule')
    }
]
  