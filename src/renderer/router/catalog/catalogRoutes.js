export default [
  {
    name: 'catalog',
    path: '/catalog',
    meta: { layout: { show_scroll: true, scroll_to_top: true } },
    props: true,
    component: () => import('@views/catalog')
  }
]
