<script>

// Utils
import { meta } from '@package'
import { toVideo } from '@utils/router/views'
import { mapGetters, mapState } from 'vuex'

// Handlers
import { sendAppDockNumberEvent } from '@main/handlers/app/appHandlers'
import { catchReleaseNotification } from '@main/handlers/notifications/notificationsHandler'

export default {
  render: () => null,
  computed: {
    ...mapGetters('favorites', { isReleaseInFavorite: 'isInFavorite' }),
    ...mapState('notifications', { _items: s => s.items }),
    ...mapState('app/settings/system', {
      _notifications: s => s.notifications.system,
      _filter_notify: s => s.filter_notify,
    }),

    /**
     * Get unseen notifications
     *
     * @return {number}
     */
    unseen () {
      return this._items.filter(item => item.is_seen === false).length
    }

  },

  created () {
    catchReleaseNotification((release => {

      // Check if release is set
      // Check if system notifications is enabled
      if (release && this._notifications === true) {
        if (this._filter_notify && !this.isReleaseInFavorite(release)) return

        // Show notification
        const episode = release.episodes[0]
        const title = episode ? episode.title : null
        const poster = release.poster.image
        const name = release.names.ru

        if (title && name) {

          // Set notification name
          require('@electron/remote').app.setAppUserModelId(meta.name)

          // Create notification
          // If the user clicks in the Notifications Center, show the app
          const notification = new window.Notification(title, {
            body: name,
            icon: poster
          })
          notification.onclick = () => toVideo(release, episode)

        }
      }

    }))
  },

  watch: {
    unseen: {
      immediate: true,
      handler (unseen) {
        sendAppDockNumberEvent(unseen)
      }
    }
  }

}
</script>
