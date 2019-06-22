<template>
	<div>
		<span>{{msg}} {{id}}</span>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				msg:'活动编辑页面',
				id:'',
			}	
		},
		created() {
			this.id = this.$route.query.id;
		}
	}
</script>

<style>
</style>
