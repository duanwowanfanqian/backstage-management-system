<template>
  <div class="dashboard-container">
    <Card></Card>
    <Sale></Sale>
    <Observe></Observe>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Card from './Card'
import Sale from './Sale'
import Observe from './Observe'

export default {
  name: 'Dashboard',

  mounted () {
    // this.$store.dispatch('getData')
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  components: {
    Card,
    Sale,
    Observe
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
	&-container {
		margin: 10px 10px;
	}
	&-text {
		font-size: 30px;
		line-height: 46px;
	}
}
</style>
