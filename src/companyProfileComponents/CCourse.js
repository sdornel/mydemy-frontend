import React from 'react'
import {Link} from 'react-router-dom'
import {Card, Form, Grid, Button} from 'semantic-ui-react'
import {connect} from 'react-redux'
import {deletingCourse, editingCourse, selectingCourseLessons} from '../redux/actions'
import CCourseModal from './CCourseModal'
import ReactDOM from 'react-dom'

class CCourse extends React.Component{
    constructor(){
        super()
        this.state = {
            editing: true,
            show: false,
            numberOfContentCovered: [],
            individualContentCovered: "",
            contentCovered: [],
            editingContentCoveredArrayIndex: "",
            // below state is for this.props.course
            id: "",
            name: "",
            textPreview: "",
            videoPreview: "",
            picture: "",
            contentCovered: "",
            difficultyLevel: "",
            duration: "",
            price: "",
            subject: "",
        }
    }

    componentWillMount(){
        this.setState({
            editing: true,
        })
    }

    showModal = () => {
        this.setState({ show: true })
    }

    hideModal = () => {
        this.setState({ show: false });
    };

    deleteCourse = (courseId, lessons) => {
        console.log("deleting", lessons)
        let courseIdAndLessons = {courseId, lessons}
        this.props.deletingCourse(courseIdAndLessons)
    }

    viewLessons = () => {
        this.props.selectingCourseLessons(this.props.course.id)
    }
    
    render(){

        const durationOptions = [
            { key: '0-3', text: '0-3 weeks', value: 1 },
            { key: '3-6', text: '3-6 weeks', value: 2 },
            { key: '6-9', text: '6-9 weeks', value: 3 },
            { key: '9-12', text: '9-12 weeks', value: 4 },
          ]
          
          const difficultyOptions = [
            { key: 'b', text: 'beginner', value: 1 },
            { key: 'i', text: 'intermediate', value: 2 },
            { key: 'a', text: 'advanced', value: 3 },
          ]

    return !this.props.course ? null : (
        <div onClick={this.editCourse}>
            <CCourseModal show={this.state.show} handleClose={this.hideModal} course={this.props.course}>
                <Form style={{overflow: 'auto', maxHeight: 600 }}>
                    <h1>Review your course details here</h1>
                    <Form.Group widths='equal'>
                        <Form.Input fluid id="name" label='Course Name' placeholder='course name' value={this.props.course.name} onChange={this.onChangeInformation}/>
                    </Form.Group>
                    <Form.Group widths="equal">
                        <Form.TextArea fluid id="textPreview" label='Course Description' placeholder='course description' value={this.props.course.text_preview} onChange={this.onChangeInformation}/>
                    </Form.Group>
                    <Form.Group widths="equal">
                        <Form.Input fluid id="duration" label='Duration' placeholder='duration' text={this.props.course.duration} value={this.props.course.duration} onChange={this.onChangeInformation}
                        fluid
                        options={durationOptions}
                        />

                        <Form.Input fluid id="dificultyLevel" label='Difficulty Level' placeholder='difficulty level' text={this.props.course.difficulty_level} value={this.props.course.difficulty_level} onChange={this.onChangeInformation}
                        fluid
                        options={difficultyOptions}
                        />
                        <Form.Input fluid id="subject" label='Subject' placeholder='subject' value={this.props.course.subject} onChange={this.onChangeInformation}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Input id="price" label='Price' type="number" placeholder='price' value={this.props.course.price} onChange={this.onChangeInformation}/>
                        <Form.Input id="videoPreview" label='Video Preview' placeholder='upload video preview url here (optional)' value={this.props.course.video_preview} onChange={this.onChangeInformation}/>
                        <Form.Input id="picture" label='Picture' placeholder='upload picture url here (optional)' value={this.props.course.picture} onChange={this.onChangeInformation}/>
                    </Form.Group>
                        <div>
                            <Form.Group widths="equal">
                                <Form.Input fluid id="contentCovered" label='Content Covered' placeholder='content covered' value={this.props.course.content_covered}/>
                            </Form.Group>
                        </div>

                        <br></br><br></br>
                </Form>
            </CCourseModal>
                <Card onClick={this.showModal}>
                    <h5 className="account-info">ID: {this.props.course.id}</h5>
                    <h5 className="account-info">Name: {this.props.course.name}</h5>
                    <h5 className="account-info">Subject: {this.props.course.subject}</h5>
                    <h5 className="account-info">Price: ${this.props.course.price}</h5>
                    <h5 className="account-info">Duration: {this.props.course.duration}</h5>
                    <h5 className="account-info">Difficulty level: {this.props.course.difficulty_level}</h5>
                            <br></br>
                </Card>
                <Grid>
                    <Grid.Column width={4}>
                        <Link to={`/course/${this.props.course.id}/lessons`}><button onClick={this.viewLessons}>View Lessons</button></Link>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        {/* <Link to={`/company/${this.props.course.id}/edit`}><button>Edit course</button></Link> */}
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <button onClick={() => this.deleteCourse(this.props.course.id, this.props.course.lessons)}>Delete</button>
                    </Grid.Column>
                </Grid>
            <br></br>
        </div>
    )}
}

const container = document.createElement('div')
document.body.appendChild(container)
ReactDOM.render(<CCourse />, container)

const mapDispatchToProps = (dispatch) => {
    return {
        deletingCourse: (courseIdAndLessons) => {dispatch( deletingCourse(courseIdAndLessons) )},
        editingCourse: (info) => {dispatch(editingCourse(info) )},
        selectingCourseLessons: (info) => {dispatch( selectingCourseLessons(info) )}
    }
}

export default connect(null, mapDispatchToProps)(CCourse)