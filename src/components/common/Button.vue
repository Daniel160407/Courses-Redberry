<script setup lang="ts">
import { computed, type Component } from "vue";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "enroll-auth"
  | "enroll-unauth"
  | "action"
  | "nav"
  | "link"
  | "icon"
  | "danger-nav"
  | "footer-link"
  | "footer-link-gray"
  | "banner-action"
  | "auth-switch-link"
  | "dialog-icon"
  | "dialog-submit"
  | "file-input-change"
  | "modal-primary"
  | "modal-outline"
  | "paginator-nav"
  | "paginator-page"
  | "sort-trigger"
  | "sort-option"
  | "accordion-header";

interface Props {
  label?: string;
  icon?: Component;
  iconPos?: "left" | "right";
  iconSize?: number;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
  variant?: ButtonVariant;
}

const props = withDefaults(defineProps<Props>(), {
  iconPos: "left",
  loading: false,
  disabled: false,
  type: "button",
  variant: "primary"
});

const STYLES: Record<ButtonVariant, string> = {
  primary: "h-14.5 rounded-md bg-[#4F46E5] px-6 py-4 text-[20px] text-[#F5F5F5] font-medium",
  secondary: "h-12 rounded-md bg-[#4F46E5] px-6.25 py-4.25 text-[16px] text-[#F5F5F5] font-medium",
  outline:
    "rounded-md border-2 border-[#958FEF] px-4 py-3 font-medium text-[#4F46E5] hover:bg-[#4F46E5] hover:text-[#F5F5F5] active:scale-95",
  "enroll-auth": "h-15.75 rounded-xl p-2.5 text-[20px] bg-[#4F46E5] font-medium text-[#FFFFFF]",
  "enroll-unauth": "h-15.75 rounded-xl p-2.5 text-[20px] bg-[#EEEDFC] font-semibold text-[#B7B3F4]",
  action: "rounded-lg bg-[#4F46E5] px-6.25 py-4.25 text-[20px] font-medium text-[#FFFFFF]",
  nav: "p-3.75 font-medium",
  link: "text-[20px] font-medium text-[#4F46E5] underline",
  icon: "p-0!",
  "danger-nav": "gap-1.75! text-[16px] font-medium text-[#8A8A8A]",
  "footer-link": "justify-start hover:underline font-medium text-[#130E67]",
  "footer-link-gray": "justify-start text-[#666666] hover:underline font-medium",
  "banner-action":
    "h-11.5 gap-2.5 rounded-lg border border-[#B7B3F4] bg-[#EEEDFC] px-3 py-2.5 text-[14px] whitespace-nowrap text-[#281ED2] [&_svg]:h-4 [&_svg]:w-4",
  "auth-switch-link": "h-4 w-12 text-sm font-medium whitespace-nowrap underline",
  "dialog-icon": "p-0! transition-opacity hover:opacity-70",
  "dialog-submit": "h-11.75 rounded-md bg-[#4F46E5] text-[#FFFFFF]",
  "file-input-change":
    "justify-start mt-1 text-left text-sm font-medium text-[#281ED2] underline underline-offset-4 hover:opacity-80",
  "modal-primary": "rounded-lg bg-[#4F46E5] text-[#FFFFFF] py-3 px-4 font-medium h-14.5",
  "modal-outline": "rounded-lg border-2 border-[#958FEF] text-[#4F46E5] py-3 px-4 font-medium h-14.5",
  "paginator-nav": "h-10 w-10 rounded-sm border border-[#D1D1D1] bg-[#FFFFFF] p-0! pl-2",
  "paginator-page": "h-10 min-w-10 rounded-sm border border-[#D1D1D1] text-[16px] font-medium",
  "sort-trigger": "rounded-lg border border-[#F5F5F5] bg-[#FFFFFF] px-5 py-1.75 text-[16px] font-medium text-[#666666]",
  "sort-option": "w-full justify-start px-5 py-2.5 text-[16px] font-medium",
  "accordion-header": "w-full justify-between! py-4 text-left font-medium [&>span]:contents"
} as const;

const BASE_STYLES = "flex items-center justify-center gap-2 transition-all duration-300 ease-out" as const;

const buttonClasses = computed(() => {
  const variantStyle = STYLES[props.variant] || STYLES.primary;
  const stateStyle = props.disabled || props.loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer";

  return [BASE_STYLES, variantStyle, stateStyle].join(" ");
});

const iconStyle = computed(() =>
  props.iconSize ? { height: `${props.iconSize}rem`, width: `${props.iconSize}rem` } : {}
);
</script>

<template>
  <button :type="props.type" :disabled="props.loading || props.disabled" :class="buttonClasses">
    <slot v-if="props.iconPos === 'left'" name="icon">
      <component :is="props.icon" v-if="props.icon" class="h-6 w-6" :style="iconStyle" />
    </slot>

    <span class="leading-none">
      <slot>{{ props.label }}</slot>
    </span>

    <slot v-if="props.iconPos === 'right'" name="icon">
      <component :is="props.icon" v-if="props.icon" class="h-6 w-6" :style="iconStyle" />
    </slot>
  </button>
</template>
