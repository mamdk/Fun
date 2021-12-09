<template>
    <div class="btns" :id="itemid" draggable="true" @dragstart="startMoveItem" @dragend="endMoveItem"
        :style="`left: ${item?.x}px;top: ${item?.y}px;width: ${size}px;height: ${size}px`">
        <button draggable="true" @dragend="endDragBtn" v-for="btn in btns" :key="btn" @click="createItem(btn)"
            :class="`btn btn-${btn}`">{{btn}}</button>
    </div>
</template>

<script>
    import {
        reactive,
        ref
    } from '@vue/reactivity'
    export default {
        name: "Item",
        props: {
            itemid: String,
            item: Object,
            size: Number
        },
        setup(props, {
            emit
        }) {
            const btns = ref([1, 2, 3, 4])
            const isMove = ref(false)
            const space = reactive({})

            const createItem = (num) => {
                emit("createItem", {
                    num,
                    id: props.itemid
                })
            }

            function startMoveItem(e) {
                if (e.shiftKey) {
                    isMove.value = true
                    const x = e.clientX
                    const y = e.clientY
                    const rect = e.target.getBoundingClientRect()

                    space.x = x - rect.x
                    space.y = y - rect.y
                }
            }


            function endMoveItem(e) {
                if (isMove.value) {
                    isMove.value = false
                    emit("moveItem", {
                        id: props.itemid,
                        x: e.clientX - space.x,
                        y: e.clientY - space.y
                    })
                }
            }





            function endDragBtn(e) {
                emit("moveBtn", {
                    x: e.clientX,
                    y: e.clientY,
                    id: props.itemid,
                    num : e.target.textContent
                })
            }



            return {
                createItem,
                btns,
                startMoveItem,
                endMoveItem,
                endDragBtn,
            }

        }
    }
</script>

<style scoped>
    .btns {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        border-radius: 10px;
        background-color: #ddd;
        z-index: 10;
    }

    .btn {
        position: absolute;
        transform: translate(-50%, -50%);
        padding: 10px;
        border-radius: 10px;
        border: none;
        opacity: 0;
        transition: .5s all;
    }

    .btns:hover .btn {
        opacity: 1;
    }

    .btn-1 {
        left: 50%;
        top: 0;
    }

    .btn-2 {
        left: 100%;
        top: 50%;
    }

    .btn-3 {
        left: 50%;
        top: 100%;
    }

    .btn-4 {
        left: 0;
        top: 50%;
    }
</style>