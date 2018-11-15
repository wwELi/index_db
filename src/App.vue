<template>
<section style="width:800px;padding: 20px 10px;border: 1px solid #999">
  <el-form style="width: 500px;margin-top: 20px;border-bottom: 1px solid #dbdbdb" :rules="rules"  ref="form" :model="form" label-width="80px">
    <el-form-item label="活动名称" prop="name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="活动区域" prop="scope">
      <el-select v-model="form.scope" placeholder="请选择活动区域">
        <el-option label="区域一" value="shanghai"></el-option>
        <el-option label="区域二" value="beijing"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="活动时间" prop="time">
      <el-col :span="11">
        <el-date-picker type="date" placeholder="选择日期" v-model="form.time" style="width: 100%;"></el-date-picker>
      </el-col>
    </el-form-item>
    <el-form-item label="活动性质" prop="type">
      <el-checkbox-group v-model="form.type">
        <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
        <el-checkbox label="地推活动" name="type"></el-checkbox>
        <el-checkbox label="线下主题活动" name="type"></el-checkbox>
        <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
      </el-checkbox-group>
    </el-form-item>

    <el-form-item label="活动形式">
      <el-input type="textarea" v-model="form.remark"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
   <el-table
      stripe
      :data="tableData"
      style="width: 100%;margin-top: 20px;border: 1px solid #dbdbdb;">
      <el-table-column
        prop="id"
        label="ID"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="scope"
        label="活动区域">
      </el-table-column>
      <el-table-column
        prop="type"
        label="活动性质">
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue';
import DB from './DB';

const db = new DB('project', 3);
export default {
  data() {
      return {
        form: {
          name: '',
          scope: '',
          time: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          remark: ''
        },
        tableData: [],
        rules:{
              name: [
                { required: true, message: '请输入活动名称', trigger: 'blur' },
                { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
              ],
              scope: [
                { required: true, message: '请选择活动区域', trigger: 'change' }
              ],
              time: [
                { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
              ],
              type: [
                { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
              ],
        },
      }
    },
    mounted() {
      db.onReady().then(() => {
        db.readAll().then(list => this.tableData = list)
      });
    },
    methods: {
      onSubmit() {
        this.$refs.form.validate(valid => {
          if (!valid) {
            return;
          }

          db.add(this.form)
            .then(() => {
              this.$notify({
                    title: '提示',
                    message: '数据库写入成功',
                    duration: 0
                });

                console.log(this.form);

                db.readAll().then(list => this.tableData = list);
            })
            .catch(() => {
              this.$notify({
                    title: '提示',
                    message: '数据库写入失败',
                    duration: 0
                });
            });
            })

        
      }
    }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
