<template>
  <Item @moveBtn="moveBtn" :size="SIZE" @moveItem="moveItem" v-for="(item, i) in Object.keys(items)" :key="i"
    :item="items[item]" :itemid="item" @createItem="createNewItem" />
  <svg style="position: absolute;width: 100%;height: 100%;left: 0;top: 0;">
    <line v-for="(line,i) in lines" :key="i" :x1="line.x" :y1="line.y" :x2="line.xx" :y2="line.yy"
      style="stroke:#aaa;stroke-width:2" />
  </svg>
</template>

<script>
  import {
    reactive,
    ref,
  } from 'vue'
  import Item from './components/item.vue'
  import {
    createId
  } from './utils/utils'

  const SPACE = 150;
  const SIZE = 100;

  export default {
    name: 'App',
    components: {
      Item
    },
    setup() {
      const items = reactive({
        start: {
          x: window.innerWidth / 2 - (SIZE / 2),
          y: window.innerHeight / 2 - (SIZE / 2)
        }
      })
      const itemsChild = reactive({})
      const lines = ref([])

      function createNewItem({
        num,
        id
      }) {
        let numNewItem = 0
        const newId = createId()
        if (itemsChild[id] && itemsChild[id][num]) return

        if (itemsChild[id]) itemsChild[id][num] = newId
        else itemsChild[id] = {
          [num]: newId
        }

        const rectParent = document.querySelector(`#${id}`).getBoundingClientRect();
        let x = rectParent.x,
          y = rectParent.y;


        if (num === 1) {
          y -= SPACE
          numNewItem = 3
        } else if (num === 3) {
          y += SPACE
          numNewItem = 1
        } else if (num === 2) {
          x += SPACE
          numNewItem = 4

        } else if (num === 4) {
          x -= SPACE
          numNewItem = 2
        }

        if (itemsChild[newId]) itemsChild[newId][numNewItem] = id
        else itemsChild[newId] = {
          [numNewItem]: id
        }


        lines.value.push({
          item1: id,
          item2: newId,
          x: rectParent.x + (SIZE / 2),
          y: rectParent.y + (SIZE / 2),
          xx: x + (SIZE / 2),
          yy: y + (SIZE / 2)
        })


        items[newId] = {
          num,
          x,
          y
        }

      }

      function moveItem({
        id,
        x,
        y
      }) {
        items[id].x = x
        items[id].y = y

        lines.value.forEach((l) => {
          if (l.item1 === id) {
            l.x = x + (SIZE / 2)
            l.y = y + (SIZE / 2)
          } else if (l.item2 === id) {
            l.xx = x + (SIZE / 2)
            l.yy = y + (SIZE / 2)
          }
        })
      }

      function moveBtn({
        x,
        y,
        id,
        num
      }) {
        const selectItem = Object.keys(items).find(item =>
          items[item].x <= x && items[item].y <= y && items[item].x + SIZE >= x && items[item].y + SIZE >= y
        )

        if (selectItem) {
          const rectItem1 = document.querySelector(`#${id}`).getBoundingClientRect();
          const rectItem2 = document.querySelector(`#${selectItem}`).getBoundingClientRect();

          if (itemsChild[id]) itemsChild[id][num] = selectItem
          else itemsChild[id] = {
            [num]: selectItem
          }


          lines.value.push({
            item1: id,
            item2: selectItem,
            x: rectItem1.x + (SIZE / 2),
            y: rectItem1.y + (SIZE / 2),
            xx: rectItem2.x + (SIZE / 2),
            yy: rectItem2.y + (SIZE / 2)
          })

        }
      }



      return {
        createNewItem,
        items,
        itemsChild,
        lines,
        moveItem,
        SIZE,
        moveBtn
      }
    }
  }
</script>

<style>
  html,
  body {
    margin: 0;
    width: 100%;
    height: 100%;
  }
</style>