<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <Card />
    <Sale />
    <Observe />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Card from './card/index.vue'
import Sale from './sale/index.vue'
import Observe from './observe/index.vue'
export default {
  name: 'Dashboard',
  components: {
    Card,
    Sale,
    Observe
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  mounted() {
    this.$store.dispatch('getData')
  }

}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
