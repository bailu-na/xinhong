<script setup>
import { ref, inject, onMounted } from "vue";
import * as XLSX from 'xlsx';
import { ElMessage } from 'element-plus';

const api = inject('api');

let dialogFormVisible = ref(false);
let answerDialogVisible = ref(false);
let form = ref({
    theme: '',
    questions: [],
    timelimit: ''
});

let selectedAnswers = ref([]);
let questionThemes = ref([]); // 题目主题列表
let currentTheme = ref(''); // 当前选中的主题
const questionlist = ref([]);

const getThemes = () => {
    api.getThemes((res) => {
        if (res.data.status === 200) {
            questionThemes.value = res.data.data;
            console.log('获取主题列表', questionThemes)
        } else {
            ElMessage.error('获取主题列表失败');
        }
    });
};

const getQuestionsByTheme = (theme) => {
    currentTheme.value = theme;
    api.getQuestionsByTheme(theme, (res) => { // 传递正确的请求体
        if (res.data.status === 200) {
            console.log(theme);
            console.log('获取题目成功：', res.data.data);
            questionlist.value = res.data.data.map(question => {
                return {
                    ...question,
                    time: new Date(question.time).toLocaleString()
                };
            })
                .sort((a, b) => new Date(a.time) - new Date(b.time)); // 按发布时间升序排序
        } else {
            console.error('获取题目失败：', res.data.message);
            ElMessage.error('获取题目失败：' + res.data.message);
            questionlist.value = [];
        }
    });
};

const addQuestion = () => {
    form.value.questions.push({
        title: '',
        type: 'a',
        Aselection: '',
        Bselection: '',
        Cselection: '',
        Dselection: '',
        result: '',
    });
};

const upload = () => {
    const formData = new FormData();
    formData.append('theme', form.value.theme);
    formData.append('timelimit', new Date(form.value.timelimit).toISOString());
    formData.append('questions', JSON.stringify(form.value.questions));

    api.upload_question(formData, (res) => {
        if (res.data.status === 200) {
            ElMessage.success('发布成功');
            form.value.theme = '';
            form.value.timelimit = '';
            form.value.questions = [];
            dialogFormVisible.value = false;
            getQuestionsByTheme(currentTheme.value);
        } else {
            ElMessage.error('发布失败');
        }
    });
};

const deleteQuestion = (id) => {
    api.deleteQuestion(id, (res) => {
        if (res.status === 200) {
            ElMessage.success('删除题目成功');
            getQuestionsByTheme(currentTheme.value);
        } else {
            ElMessage.error('删除题目失败：' + res.message);
        }
    });
};

const compare = (content, result) => {
    const sortedStr1 = content.split('').sort().join('');
    const sortedStr2 = result.split('').sort().join('');
    return sortedStr1 === sortedStr2;
};

const exportToExcel = () => {
    const filteredData = selectedAnswers.value.map(answer => ({
        '学号': answer.userId,
        '答案': answer.answer,
        '是否正确': answer.correct ? '正确' : '错误'
    }));

    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '答题情况');
    XLSX.writeFile(wb, '答题情况表.xlsx');
};

const showDialog = () => {
    dialogFormVisible.value = true;
};

onMounted(() => {
    getThemes();
    getQuestionsByTheme('');
});

const removeQuestion = (index) => {
    form.value.questions.splice(index, 1);
};

const submitForm = () => {
    if (!form.value.timelimit) {
        ElMessage.error('请选择截止时间');
        return;
    }
    upload();
};

const checklist = (id, result) => {
    api.getanswerlist(id, (res) => {
        if (res.data.status === 200) {
            selectedAnswers.value = res.data.data.map(answer => ({
                userId: answer.userId,
                answer: answer.answer,
                correct: compare(answer.answer, result)
            }));
            answerDialogVisible.value = true;
        } else {
            ElMessage.error('获取答题情况失败');
        }
    });
};
</script>

<template>
    <div class="main">
        <div class="center">
            <el-button type="primary" @click="showDialog" size="large" style="font-size: medium;">
                <el-icon>
                    <CirclePlusFilled />
                </el-icon>&nbsp;&nbsp;发布答题
            </el-button>

            <el-dialog v-model="dialogFormVisible" title="发布答题" center>
                <el-form ref="questionForm" :model="form" label-width="100px">
                    <el-form-item label="主题">
                        <el-input v-model="form.theme" placeholder="请输入主题"></el-input>
                    </el-form-item>

                    <div v-for="(question, index) in form.questions" :key="index"
                        style="margin-bottom: 20px; border: 1px solid #e0e0e0; padding: 10px;">
                        <h4>题目 {{ index + 1 }}</h4>
                        <el-form-item label="题目内容">
                            <el-input v-model="question.title" type="textarea" :rows="3"
                                placeholder="请输入题目内容"></el-input>
                        </el-form-item>
                        <el-form-item label="题目类型">
                            <el-select v-model="question.type" placeholder="请选择题目类型">
                                <el-option label="单项选择" value="a" />
                                <el-option label="多项选择" value="b" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="选项A">
                            <el-input v-model="question.Aselection" placeholder="选项A"></el-input>
                        </el-form-item>
                        <el-form-item label="选项B">
                            <el-input v-model="question.Bselection" placeholder="选项B"></el-input>
                        </el-form-item>
                        <el-form-item label="选项C">
                            <el-input v-model="question.Cselection" placeholder="选项C"></el-input>
                        </el-form-item>
                        <el-form-item label="选项D">
                            <el-input v-model="question.Dselection" placeholder="选项D"></el-input>
                        </el-form-item>
                        <el-form-item label="答案">
                            <el-input v-model="question.result" placeholder="请输入答案"></el-input>
                        </el-form-item>
                        <el-button type="danger" @click="removeQuestion(index)" size="small">删除</el-button>
                    </div>

                    <el-button @click="addQuestion" type="primary" size="small" style="margin: 20px;">
                        <el-icon>
                            <CirclePlusFilled />
                        </el-icon>&nbsp;&nbsp;添加题目
                    </el-button>
                </el-form>
                <el-form-item label="截止时间">
                    <el-date-picker v-model="form.timelimit" type="datetime" placeholder="请选择截止时间"></el-date-picker>
                </el-form-item>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitForm">发布</el-button>
                </span>
            </el-dialog>

            <el-dialog v-model="answerDialogVisible" title="答题情况" center>
                <el-table :data="selectedAnswers" style="width: 100%;" stripe border
                    :cell-style="{ textAlign: 'center' }" :header-cell-style="{ 'text-align': 'center' }">
                    <el-table-column prop="userId" label="学号" width="120"></el-table-column>
                    <el-table-column prop="answer" label="答案" width="120"></el-table-column>
                    <el-table-column prop="correct" label="是否正确" width="120">
                        <template v-slot="{ row }">
                            <el-text>{{ row.correct ? '正确' : '错误' }}</el-text>
                        </template>
                    </el-table-column>
                </el-table>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="answerDialogVisible = false">关闭</el-button>
                    <el-button type="primary" @click="exportToExcel">导出为Excel</el-button>
                </span>
            </el-dialog>

            <!-- 主题列表展示 -->
            <el-table :data="questionThemes" style="width: 100%; margin-top: 20px;" stripe border
                :cell-style="{ textAlign: 'center' }" :header-cell-style="{ 'text-align': 'center' }">
                <el-table-column type="index" label="序号" width="180"></el-table-column>
                <el-table-column label="主题" width="400">
                    <template v-slot="{ row }">
                        <el-tag type="info">{{ row }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="250">
                    <template v-slot="{ row }">
                        <el-button type="primary" @click="() => getQuestionsByTheme(row)">
                            点击查看题目
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-table v-if="currentTheme !== ''" :data="questionlist" style="width: 100%; margin-top: 20px;" stripe
                border :cell-style="{ textAlign: 'center' }" :header-cell-style="{ 'text-align': 'center' }">
                <el-table-column type="index" label="序号" width="150"></el-table-column>
                <el-table-column prop="theme" label="主题" width="150"></el-table-column>
                <el-table-column prop="title" label="题目" width="150"></el-table-column>
                <el-table-column prop="type" label="题目类型" width="160">
                    <template v-slot="{ row }">
                        <el-text>{{ row.type === 'a' ? '单选题' : '多选题' }}</el-text>
                    </template>
                </el-table-column>
                <el-table-column prop="Aselection" label="A选项" width="120"></el-table-column>
                <el-table-column prop="Bselection" label="B选项" width="120"></el-table-column>
                <el-table-column prop="Cselection" label="C选项" width="160"></el-table-column>
                <el-table-column prop="Dselection" label="D选项" width="160"></el-table-column>
                <el-table-column prop="time" label="活动截止时间" width="160">
                    <template v-slot="{ row }">
                        {{ new Date(row.time).toLocaleString() }}
                    </template>
                </el-table-column>
                <el-table-column prop="result" label="答案" width="160"></el-table-column>
                <el-table-column label="操作" width="160" fixed="right">
                    <template v-slot="{ row }">
                        <el-button link type="primary" @click="checklist(row.id, row.result)">查看答题情况</el-button>
                        <el-button link type="danger" @click="deleteQuestion(row.id)">删除题目</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<style scoped>
.main {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
}

.center {
    width: 80%;
    margin-top: 20px;
}

.el-table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
}
</style>
