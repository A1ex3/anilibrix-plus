export default [
    {
      name: 'schedule',
      path: '/schedule',
      meta: { layout: { show_scroll: true, scroll_to_top: true } },
      props: true,
      component: () => import('@views/schedule')
    }
]
  