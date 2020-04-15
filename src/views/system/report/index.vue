<template>
  <div>
    <el-tabs type="border-card" style="height: 100%">
      <el-tab-pane style="height: 500px">
        <span slot="label"><svg-icon icon-class="reportdesign" /> 报表设计</span>
        <el-row>
          <el-col :span="openFlag?6:0">
            <el-card shadow="never">
              <div slot="header" class="clearfix">
                <span v-if="openFlag" class="span-text">报表分类</span>
                <el-button v-if="openFlag" style="float: right" circle type="text" size="mini"  icon="el-icon-d-arrow-left" @click="arrowLeft"></el-button>
                <el-button v-if="openFlag" style="float: right" circle type="text" size="mini"  icon="el-icon-plus"></el-button>
                <el-button v-if="openFlag" style="float: right" circle type="text" size="mini"  icon="el-icon-search"></el-button>
              </div>
              <el-tree
                v-if="openFlag"
                :data="data"
                node-key="id"
                default-expand-all
                @node-drag-start="handleDragStart"
                @node-drag-enter="handleDragEnter"
                @node-drag-leave="handleDragLeave"
                @node-drag-over="handleDragOver"
                @node-drag-end="handleDragEnd"
                @node-drop="handleDrop"
                draggable
                :allow-drop="allowDrop"
                :allow-drag="allowDrag">
          <span class="custom-tree-node" slot-scope="{ node, data }">
              <span v-if="data.children && data.children.length">
                  <svg-icon  icon-class="folder" />
                  {{ node.label }}
              </span>
              <span v-else>
                  <svg-icon icon-class="catalog" />
                  {{ node.label }}
              </span>
          </span>
              </el-tree>
            </el-card>
          </el-col>
          <el-col :span="openFlag?18:24">
            <el-card shadow="never">
              <div slot="header" class="clearfix">
                <el-button v-if="!openFlag" style="float: left" circle type="text" size="mini"  icon="el-icon-d-arrow-right" @click="arrowRight"></el-button>
                <el-input style="float: left;width: 200px;" size="mini"></el-input>
                <el-button style="float: left;margin-left: 10px" type="primary" size="mini" icon="el-icon-search">查找</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
    export default {
      name: "reportMenu",
      data() {
        return {
          data: [{
            id: 1,
            label: '一级 1',
            children: [{
              id: 4,
              label: '二级 1-1',
              children: [{
                id: 9,
                label: '三级 1-1-1'
              }, {
                id: 10,
                label: '三级 1-1-2'
              }]
            }]
          }, {
            id: 2,
            label: '一级 2',
            children: [{
              id: 5,
              label: '二级 2-1'
            }, {
              id: 6,
              label: '二级 2-2'
            }]
          }, {
            id: 3,
            label: '一级 3',
            children: [{
              id: 7,
              label: '二级 3-1'
            }, {
              id: 8,
              label: '二级 3-2',
              children: [{
                id: 11,
                label: '三级 3-2-1'
              }, {
                id: 12,
                label: '三级 3-2-2'
              }, {
                id: 13,
                label: '三级 3-2-3'
              }]
            }]
          }],
          defaultProps: {
            children: 'children',
            label: 'label'
          },
          openFlag:true
        };
      },
      methods: {
        handleDragStart(node, ev) {
          console.log('drag start', node);
        },
        handleDragEnter(draggingNode, dropNode, ev) {
          console.log('tree drag enter: ', dropNode.label);
        },
        handleDragLeave(draggingNode, dropNode, ev) {
          console.log('tree drag leave: ', dropNode.label);
        },
        handleDragOver(draggingNode, dropNode, ev) {
          console.log('tree drag over: ', dropNode.label);
        },
        handleDragEnd(draggingNode, dropNode, dropType, ev) {
          console.log('tree drag end: ', dropNode && dropNode.label, dropType);
        },
        handleDrop(draggingNode, dropNode, dropType, ev) {
          console.log('tree drop: ', dropNode.label, dropType);
        },
        allowDrop(draggingNode, dropNode, type) {
          if (dropNode.data.label === '二级 3-1') {
            return type !== 'inner';
          } else {
            return true;
          }
        },
        allowDrag(draggingNode) {
          return draggingNode.data.label.indexOf('三级 3-2-2') === -1;
        },
        arrowLeft(){
          this.openFlag = false
        },
        arrowRight(){
          this.openFlag = true
        }
      }
    }
</script>

<style>
  .span-text{
    font-size: 15px;
  }
</style>
