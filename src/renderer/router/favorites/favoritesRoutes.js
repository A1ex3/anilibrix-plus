export default [
  {
    name: 'favorites',
    path: '/favorites',
    meta: { layout: { show_scroll: true, scroll_to_top: true } },
    props: true,
    component: () => import('@views/favorites')
  }
]
