<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content-box" :class="{'content-collapse':collapse}">
            <Breadcrumb />
            <div class="content">
                <transition name="fade-transform" mode="out-in">
                    <keep-alive>
                        <router-view v-if="$route.meta && $route.meta.keepAlive"></router-view>
                    </keep-alive> 
                </transition>
                <transition name="fade-transform" mode="out-in">
                    <router-view v-if="!$route.meta || !$route.meta.keepAlive"></router-view> 
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import vHead from './common/Header.vue';
import Breadcrumb from '@/components/Breadcrumb'
import vSidebar from '@/components/Sidebar';
export default {
    data() {
        return {
            tagsList: [],
            collapse: false
        };
    },
    components: {
        vHead,
        vSidebar,
        Breadcrumb
    },
    created() {
        eventBus.$on('collapse-content', msg => {
            this.collapse = msg;
        });
    }
};
</script>
