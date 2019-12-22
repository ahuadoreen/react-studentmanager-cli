import React, { useState } from 'react';
import { Route } from 'react-router-dom';
import styles from './home.module.css';
import loadable from "../util/loadable";
import Header from "../components/header/view";
import Sidebar from "../components/sidebar/view";
const Overview = loadable(()=>import('./overview/overview'));
const Subject = loadable(()=>import('./subject/subject'));
const SubjectForm = loadable(()=>import('./subject/subjectForm'));
const Teacher = loadable(()=>import('./teacher/teacher'));
const TeacherForm = loadable(()=>import('./teacher/teacherForm'));
const GradeCourse = loadable(()=>import('./gradeCourse'));
const Class = loadable(()=>import('./class/class'));
const ClassForm = loadable(()=>import('./class/classForm'));
const CourseTeacher = loadable(()=>import('./class/courseTeacher'));
const Student = loadable(()=>import('./student/student'));
const StudentForm = loadable(()=>import('./student/studentForm'));

const HomePage = (props) => {
  const pathname = props.location.pathname;
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? 80 : 256;
  const sidebarStyle = {
    flex: '0 0 ' + sidebarWidth + 'px',
    width: sidebarWidth + 'px'
  };

  return (
    <div className="ant-layout ant-layout-has-sider">
      <div style={sidebarStyle} className="ant-layout-sider ant-layout-sider-dark">
        <Sidebar collapsed={collapsed} pathname = {pathname} />
      </div>
      <div className={`${styles['content-wrapper']} ant-layout`}>
        <div className={`${styles.header} ant-layout-header`}>
          <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>
        <div className={`${styles.content} ant-layout-content`}>
          <Route path="/home/overview" component={Overview} />
          <Route path="/home/subject" component={Subject} />
          <Route path="/home/addSubject" component={SubjectForm} />
          <Route path="/home/teacher" component={Teacher} />
          <Route path="/home/addTeacher" component={TeacherForm} />
          <Route path="/home/gradeCourse" component={GradeCourse} />
          <Route path="/home/class" component={Class} />
          <Route path="/home/addClass" component={ClassForm} />
          <Route path="/home/courseTeacher/:id/:grade" component={CourseTeacher} />
          <Route path="/home/student" component={Student} />
          <Route path="/home/addStudent" component={StudentForm} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
