<template>
  <v-fade-transition appear mode="out-in">
    <v-layout v-if="loading" column align-center justify-center class="schedule">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-layout>
    <v-layout v-else column class="schedule">
      <v-tabs v-model="selectedDayIndex" centered>
        <v-tab v-for="(day, index) in daysOfWeek" :key="index" :class="{ 'current-day': index === todayIndex }">
          {{ day }}
        </v-tab>
      </v-tabs>
      <v-container>
        <v-row>
          <v-col v-for="release in data[selectedDayIndex].list" :key="release.id" cols="12" sm="6" md="4" lg="3">
            <v-card class="schedule-card" :ref="release.id" @click="toRelease(release)">
              <v-img :src="staticEndpointURL + release.posters.small.url" class="schedule-image">
                <div class="overlay">
                  <v-card-title class="title">{{ release.names.ru }}</v-card-title>
                  <v-card-subtitle class="subtitle">Эпизоды: {{ release.player.episodes.string }}</v-card-subtitle>
                </div>
              </v-img>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-layout>
  </v-fade-transition>
</template>

<script>
import { AppKeyboardHandlerMixin } from '@mixins/app';
import ScheduleProxy from '@proxies/schedule';
import { toRelease } from '@utils/router/views'

export default {
  name: 'ScheduleView',
  meta: { title: 'Расписание' },
  mixins: [AppKeyboardHandlerMixin],

  data() {
    return {
      data: [],
      loading: true,
      todayIndex: -1,
      selectedDayIndex: 0, // Default to the first day of the week
      staticEndpointURL: '',
      daysOfWeek: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
    };
  },

  async created() {
    let _scheduleProxy = new ScheduleProxy();
    try {
      let scheduleResponse = await _scheduleProxy.getSchedule();
      this.data = scheduleResponse;

      // Determine today's index
      let today = new Date().getDay(); // 0 (Sunday) to 6 (Saturday)
      this.todayIndex = today === 0 ? 6 : today - 1; // Adjust index for Sunday

      // Set selectedDayIndex to today
      this.selectedDayIndex = this.todayIndex;

      this.staticEndpointURL = require('@store/index').default?.state?.app?.settings?.system?.api?.static_endpoint;
    } catch (error) {
      console.error(error);
      this.$toasted.error('Не удалось получить расписание релизов');
    } finally {
      this.loading = false; // Hide loading spinner when data fetching is done
    }
  },

  methods: {
    toRelease
  },
};
</script>

<style scoped>
.schedule {
  padding: 20px;
}

.schedule-card {
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: relative;
  overflow: hidden;
}

.schedule-image {
  object-fit: cover;
  transition: 0.3s ease;
  height: calc(35vh + 150px);
  min-height: 350px;
  max-height: 500px;
  width: 100%;
}

.overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
  transition: .5s ease;
  background-color: rgba(50, 50, 50, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 20px;
}

.schedule-card:hover .overlay {
  opacity: 1;
}

.title {
  font-size: 16px;
  font-weight: bold;
  margin: 0;
  text-align: center;
}

.subtitle {
  font-size: 14px;
  color: #ccc;
  text-align: center;
}

.current-day {
  color: #f44336;
  font-weight: bold;
}
</style>