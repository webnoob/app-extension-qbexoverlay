<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-btn  color="white" class="text-black on-right" @click="setLocalStorage">Set local storage</q-btn>
        <q-btn color="white" class="text-black on-right" @click="getLocalStorage">Get local storage</q-btn>

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      content-class="bg-grey-2"
    >
      <q-list>
        <q-item-label header>Essential Links</q-item-label>
        <q-item clickable tag="a" target="_blank" href="https://quasar.dev">
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Docs</q-item-label>
            <q-item-label caption>quasar.dev</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://github.quasar.dev">
          <q-item-section avatar>
            <q-icon name="code" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Github</q-item-label>
            <q-item-label caption>github.com/quasarframework</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://chat.quasar.dev">
          <q-item-section avatar>
            <q-icon name="chat" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Discord Chat Channel</q-item-label>
            <q-item-label caption>chat.quasar.dev</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://forum.quasar.dev">
          <q-item-section avatar>
            <q-icon name="record_voice_over" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Forum</q-item-label>
            <q-item-label caption>forum.quasar.dev</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://twitter.quasar.dev">
          <q-item-section avatar>
            <q-icon name="rss_feed" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Twitter</q-item-label>
            <q-item-label caption>@quasarframework</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://facebook.quasar.dev">
          <q-item-section avatar>
            <q-icon name="public" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Facebook</q-item-label>
            <q-item-label caption>@QuasarFramework</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class="flex flex-center">
      <div class="row justify-center items-center">
        <q-input
          v-for="tab in tabs"
          :key="tab.id"
          :label="`Tab ID: ${tab.id}`"
          :value="tab.url"
          class="col-12"
        />
      </div>

      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL, uid } from 'quasar'

export default {
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: false,
      tabs: []
    }
  },
  methods: {
    openURL,
    setLocalStorage () {
      this.$q.bex.send('test', { name: 'Allan ' + uid() })
      this.$q.bex.send('someEvent', { allan: 'test' })
      // this.$q.localStorage.set('someKeyForLocalStorage', uid())
    },
    getLocalStorage () {
      this.$q.localStorage.getItem('someKeyForLocalStorage').then(r => {
        this.$q.notify({
          message: r
        })
      })
    }
  },
  mounted () {
    this.$q.bex.on('ready', d => {
      console.log('Bex backend ready')
    })

    this.$q.bex.on('browserTabCreated', data => {
      const tab = data.tab
      this.tabs.push({
        id: tab.id,
        url: ''
      })
      this.$q.notify({
        message: `You opened a new tab: [${tab.id}] - ${tab.title}`
      })
    })

    this.$q.bex.on('browserTabUpdated', data => {
      for (let tab of this.tabs) {
        if (tab.id === data.tab.id) {
          tab.url = data.changeInfo.url
        }
      }
    })
  }
}
</script>

<style lang="stylus">
  .q-app-injected
    .q-layout
      min-height unset !important
      transform 'translateY(-50px)'
      position fixed
      top 0
      z-index: 2000 !important;

      .q-page
        min-height unset !important
</style>
