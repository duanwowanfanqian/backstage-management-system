<template>
  <div>
    <div class="card-header">
      <span>{{title}}</span>
      <svg t="1659408427118"
           class="icon"
           viewBox="0 0 1024 1024"
           version="1.1"
           xmlns="http://www.w3.org/2000/svg"
           p-id="1806"
           width="16"
           height="16">
        <path d="M512 896C299.936 896 128 724.064 128 512S299.936 128 512 128s384 171.936 384 384-171.936 384-384 384m0-832C264.96 64 64 264.96 64 512s200.96 448 448 448 448-200.96 448-448S759.04 64 512 64"
              fill="#bfbfbf"
              p-id="1807"></path>
        <path d="M480 768h64v-288h-64zM512 272a48 48 0 1 0 0 96 48 48 0 0 0 0-96"
              fill="#bfbfbf"
              p-id="1808"></path>
      </svg>
    </div>
    <div class="card-content">
      {{count}}
    </div>
    <div class="card-charts">
      <slot name="charts"></slot>
    </div>
    <div class="card-footer">
      <slot name="footer"></slot>

    </div>
  </div>
</template>

<script>
export default {
  name: 'Detail',
  props: ['title', 'count']
}
</script>

<style scoped>
.card-header {
	display: flex;
	justify-content: space-between;
	color: #d9d9d9;
}
.card-content {
	font-size: 30px;
	padding: 10px 0px;
}
.card-charts {
	height: 50px;
}
.card-footer {
	border-top: 1px solid #eee;
	padding-top: 10px;
}
</style>