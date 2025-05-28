<template>
	<view>
		<view class="tui-selected-class tui-dropdown-list">
			<!-- 选择区域插槽（如不需要可忽略） -->
			<slot name="selectionbox"></slot>

			<!-- 下拉菜单区域 -->
			<view class="tui-dropdown-view" :class="{ 'tui-dropdownlist-show': show }"
				:style="{
					backgroundColor: backgroundColor,
					top: top + 'rpx'
				}"
			>
				<slot name="dropdownbox"></slot>
			</view>
		</view>

		<!-- 遮罩层 -->
		<view
			class="tui-dropdown__mask"
			:style="{ backgroundColor: maskBackground }"
			v-if="isMask && show"
			@tap.stop="maskClick"
		/>
	</view>
</template>

<script>
export default {
	name: 'tuiDropdownList',
	emits: ['close'],
	props: {
		show: {
			type: Boolean,
			default: false
		},
		backgroundColor: {
			type: String,
			default: 'transparent'
		},
		top: {
			type: Number,
			default: 0
		},
		selectHeight: {
			type: Number,
			default: 0
		},
		isMask: {
			type: Boolean,
			default: false
		},
		maskBackground: {
			type: String,
			default: 'transparent'
		}
	},
	methods: {
		maskClick() {
			this.$emit('close', {})
		}
	}
};
</script>

<style scoped>
.tui-dropdown-list {
	position: relative;
	z-index: 12;
}

.tui-dropdown-view {
	width: 100%;
	overflow: hidden;
	position: absolute;
	left: 0;
	z-index: -99;
	opacity: 0;
	max-height: 0;
	transition: max-height 0.3s ease, opacity 0.2s ease;
}

.tui-dropdownlist-show {
	opacity: 1;
	z-index: 996;
	max-height: 1000rpx; /* 最大高度限制，防止撑爆 */
}

.tui-dropdown__mask {
	width: 100%;
	height: 100%;
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 5;
}
</style>
