<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>
	.app-main {
	  /*50 = navbar  */
	  min-height: calc(100vh - 50px);
	  width: 100%;
	  position: relative;
	  overflow: hidden;
		padding: 40px;
	}
</style>
