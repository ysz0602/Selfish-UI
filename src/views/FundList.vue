<template>
    <div class="fillContainer">
        <div>
            <el-form :inline="true" ref="add_data" :model="search_data">
                <el-form-item label="按照时间筛选">
                    <el-date-picker
                        v-model="search_data.value"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="right">                        
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" icon="search" @click="handleSearch()">筛选</el-button>
                </el-form-item>
                <el-form-item class="btnRight">
                    <el-button
                    type="primary"
                    size="small"
                    icon="view"
                    v-if="user.identity === 'manager'"
                    @click="handleAdd()">添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table_container">
            <el-table
                v-if="tableData.length"
                :data="tableData"
                max-height="450"
                border
                style="width: 100%">
                <el-table-column
                    type="index"
                    label="序号"
                    align="center"
                    fixed="left"
                    width="70">
                </el-table-column>
                <el-table-column
                    prop="date"
                    label="创建时间"
                    align="center"
                    width="250">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{ scope.row.date }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="type"
                    label="收支类型"
                    align="center"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="describe"
                    label="收支描述"
                    align="center"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="income"
                    label="收入"
                    align="center"
                    width="170">
                    <template slot-scope="scope">
                        <span style="color: #00d053">{{ scope.row.income }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="expend"
                    label="支出"
                    align="center"
                    width="170">
                    <template slot-scope="scope">
                        <span style="color: #f56767">{{ scope.row.expend }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="cash"
                    label="账户现金"
                    align="center"
                    width="170">
                    <template slot-scope="scope">
                        <span style="color: #4db3ff">{{ scope.row.cash }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="remark"
                    label="备注"
                    align="center"
                    width="220">
                </el-table-column>
                <el-table-column
                    prop="operation"
                    label="操作"
                    align="center"
                    fixed="right"
                    width="180"
                    v-if="user.identity === 'manager'">
                    <template slot-scope="scope">
                        <el-button
                            type="warning"
                            size="small"
                            icon="edit"
                            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                            type="danger"
                            size="small"
                            icon="delete"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-col :span="24">
                    <div class="pagination">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="paginations.page_index"
                            :page-sizes="paginations.page_sizes"
                            :page-size="paginations.page_size"
                            :layout="paginations.layout"
                            :total="paginations.total">
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </div> 
        <FundDialog :dialog="dialog" :formData="formData" @update="getProfile"></FundDialog> 
    </div>
</template>
<script>
import FundDialog from '../components/FundDialog'
export default {
    name: 'fundList',
    components: {
        FundDialog
    },
    data() {
        return {
            search_data: {
                value: []
            },
            filterTableData: [],
            paginations: {
                page_index: 1, // 当前页码
                total: 0, // 总数
                page_size: 5, // 条数
                page_sizes: [5, 10, 15, 20],
                layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
            },
            tableData: [],
            allTableData: [],
            formData: {
                type: '',
                describe: '',
                income: '',
                expend: '',
                cash: '',
                remark: '',
                id: ''
            },
            dialog: {
                show: false,
                title: '',
                option: 'edit'
            }
        }
    },
    computed: {
        user() {
            return this.$store.getters.user
        }
    },
    created() {
        this.getProfile()
    },
    methods: {
        getProfile() {
            // 获取表格数据
            this.$axios.get('/api/profiles')
                .then(res => {
                    this.allTableData = res.data
                    this.filterTableData = res.data
                    // 设置分页数据
                    this.setPaginations()
                })
                .catch(err => console.log(err))
        },
        setPaginations() {
            // 分页属性设置
            this.paginations.total = this.allTableData.length
            this.paginations.page_index = 1
            this.paginations.page_size = 5
            // 设置默认分页数据
            this.tableData = this.allTableData.filter((item, index) => {
                return index < this.paginations.page_size
            })
        },
        handleEdit(index, row) {
            // 编辑
            this.dialog = {
                show: true,
                title: '修改资金信息',
                option: 'edit'
            }
            this.formData = {
                type: row.type,
                describe: row.describe,
                income: row.income,
                expend: row.expend,
                cash: row.cash,
                remark: row.remark,
                id: row._id
            }
        },
        handleDelete(index, row) {
            this.$axios.delete(`/api/profiles/delete/${row._id}`)
                .then(res => {
                    this.$message('删除成功！')
                    this.getProfile()
                })
                .catch(err => console.log(err))
        },
        handleAdd() {
            this.dialog = {
                show: true,
                title: '添加资金信息',
                option: 'add'
            }
            this.formData = {
                type: '',
                describe: '',
                income: '',
                expend: '',
                cash: '',
                remark: '',
                id: ''
            }
        },
        handleSizeChange(page_size) {
            // 切换 size
            this.paginations.page_index = 1
            this.paginations.page_size = page_size
            // 设置默认分页数据
            this.tableData = this.allTableData.filter((item, index) => {
                return index < page_size
            })
        },
        handleCurrentChange(page) {
            // 获取当前页
            let index = this.paginations.page_size * (page - 1)
            // 数据总数
            let nums = this.paginations.page_size * page
            // 容器
            let tables = []
            for (let i = index; i < nums; i++) {
                if (this.allTableData[i]) {
                    tables.push(this.allTableData[i])
                }
                this.tableData = tables     
            }
        },
        handleSearch() {
            // 筛选
            if (this.search_data.value.length !== 2) {
                this.$message({
                    type: 'warning',
                    message: '请选择时间区间'
                })
                this.getProfile()
                return
            }
            const startTime = this.search_data.value[0].getTime()
            const endTime = this.search_data.value[1].getTime()
            this.allTableData = this.filterTableData.filter((item, index) => {
                let time = new Date(item.date).getTime()
                return startTime <= time && endTime >= time
            })
            // 分页数据
            this.setPaginations()
        }
    }
}
</script>

<style scoped>
.fillContainer{
    width: 100%;
    height: 100%;
    padding: 16px;
    box-sizing: border-box
}
.btnRight{
    float: right;
}
.pagination{
    text-align: right;
    margin-top: 10px;
}
</style>