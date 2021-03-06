import { ObjectFlags } from "typescript"

const BASE_URL = 'http://localhost:3000'
const COURSES_URL = 'http://localhost:3000/courses'
const USER_URL = 'http://localhost:3000/users'
const PURCHASES_URL = 'http://localhost:3000/purchases'
const LOGIN_URL = 'http://localhost:3000/login'
const COMPANY_LOGIN_URL = 'http://localhost:3000/company-login'
const COMPANY_URL = 'http://localhost:3000/companies'
const LESSON_URL = 'http://localhost:3000/lessons'

let currentUser: any
let currentUserId: number
let currentCompany: any
let currentCompanyId: number
let allCourses: any
let currentUserCart: any
let newlyCreatedCourse: any

// function fetchingLessons(){
//     return (dispatch) => {
//         fetch(LESSON_URL)
//     }
// }

function fetchedCourses(courses: any[]){
    return {type: "FETCHED_COURSES", payload: courses}
} 

function fetchingCourses(){
    return (dispatch: any) => {
        fetch(COURSES_URL)
        .then(resp => resp.json())
        .then(courses => {
            // "one↵two↵three".replace("↵", "\n")
            allCourses = courses
            dispatch(fetchedCourses(courses))
        })
    }
}

function fetchedUser(user: object){
    return {type: "FETCHED_USER", payload: user}
}

function fetchingUser(email: string, password: string, face: any[]){
    return (dispatch: any) => {
    // return (dispatch) => {
    let obj = {
        email: email,
        password: password
    }
        fetch(LOGIN_URL, {
            method: "POST",
            headers: {
            "Content-Type" : "application/json",
            "Accept" : "application/json",
            },
            body: JSON.stringify(obj)
            }).then(resp => resp.json())
            .then(user => { 
                if(email === "nofacialrec@demo.com"){ // prevent facial recognition being used on this user
                    localStorage.setItem("token", user.token)
                    localStorage.setItem("user_or_company", "user")
                    currentUserId = user.user.id
                    window.location.reload();
                    if(!user.status){
                        currentUser = user.user
                        dispatch(fetchedUser(user.user))
                    }
                }else{
                
                    if(user.error_message){
                        alert(user.error_message)
                    }else{
                        if( face === undefined || face[0] === undefined || face[0].length === 0 || face[0]._label && face[0]._label !== user.user.email){
                            alert("Your face was not recognized as belonging to this user. Please try again.")
                        }
                        else{
                            localStorage.setItem("token", user.token)
                            localStorage.setItem("user_or_company", "user")
                            // currentUser = user.user
                            currentUserId = user.user.id
                            // fetch(USER_URL + `/${currentUserId}`) // fetches user courses and purchases
                            // .then(resp => resp.json())
                            // .then(user => {
                                if(!user.status){
                                    currentUser = user.user
                                    dispatch(fetchedUser(user.user))
                                }
                        //     }
                        // )
                // dispatch(fetchedUser(user.user))
                }}
            } // else statement closing bracket for !== nofacialrec@demo.com
        })
    }
}

function gettingProfileFetch(){
    return (dispatch: any) => {
            if(localStorage.token && localStorage.user_or_company === "user") {
            fetch(LOGIN_URL, { // fetches user minus courses and purchases
                headers: {"Authenticate": localStorage.token}
            })
            .then(resp => resp.json())
            .then(user => { 
                // currentUser = user
                currentUserId = user.id
                if(user.message){
                    localStorage.removeItem("token")
                }else{
                fetch(USER_URL + `/${currentUserId}`) // fetches user courses and purchases
                .then(resp => resp.json())
                .then(user => {
                    if(!user.status){
                        currentUser = user
                        dispatch(gotProfileFetch(user))
                    }
                })
                }
            })
        }
    }
}

function gotProfileFetch(user: object){
    return {type: "GOT_PROFILE_FETCH", payload: user}
}


interface newUserInfoTs {
    name: string,
    email: string
}

function editingUserInfo(newUserInfo: newUserInfoTs){
    return (dispatch: any) => {
    console.log("GOT TO EDIT USER INFO", newUserInfo)
    let obj = {
        name: newUserInfo.name,
        email: newUserInfo.email
        // name: newUserInfo,
        // email: newUserInfo
    }
    fetch(USER_URL + `/${currentUserId}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json",
        "Accept": "application/json"},
        body: JSON.stringify(obj)
    }).then(resp => resp.json())
    .then(updatedUser => {
        // currentUser = updatedUser
        currentUser.name = updatedUser.name
        currentUser.email = updatedUser.email
        // fetch(USER_URL + `/${currentUserId}`)
        // .then(resp => resp.json())
        // .then(updatedWithCoursesAndPurchases => {
            // dispatch(editedUserInfo(updatedWithCoursesAndPurchases))
            dispatch(editedUserInfo(currentUser))
            // })
        })
    }
}

function editedUserInfo(updatedUser: object){
    return {type: "EDITED_USER_INFO", payload: updatedUser}
}

interface newCompanyInfoTs {
    name: string,
    email: string
}

function editingCompanyInfo(newCompanyInfo: newCompanyInfoTs){
    return (dispatch: any) => {
        let obj = {
            name: newCompanyInfo.name,
            email: newCompanyInfo.email
        }
        currentCompanyId = currentCompany.id // temporary fix
        fetch(COMPANY_URL + `/${currentCompanyId}`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json",
            "Accept": "application/json"},
            body: JSON.stringify(obj)
        }).then(resp => resp.json())
        .then(updatedCompany => {
            currentCompany = updatedCompany
        fetch(COMPANY_URL + `/${currentCompanyId}`)
        .then(resp => resp.json())
        .then(updatedWithCoursesAndPurchases => {
            for(let i = 0; i < allCourses.length; i++){
                for(let j = 0; j < updatedWithCoursesAndPurchases.courses.length; j++){
                    if(allCourses[i].id === updatedWithCoursesAndPurchases.courses[j].id){
                        allCourses[i].company.name = updatedWithCoursesAndPurchases.name
                        dispatch(changedCompanyNameOfCourse(allCourses[i]))
                    }
                }
            }
            dispatch(editedCompanyInfo(updatedWithCoursesAndPurchases))
            })

        })
    }
}

function editedCompanyInfo(updatedCompany: object){
    return {type: "EDITED_COMPANY_INFO", payload: updatedCompany}
}

function changedCompanyNameOfCourse(updatedCourse: object){
    return {type: "CHANGED_COMPANY_NAME_OF_COURSE", payload: updatedCourse}
}

function logoutUser(currentUser: object){
    return {type: 'LOGOUT_USER', payload: currentUser}
}

function fetchedUserCart(cart: object){
    return {type: "FETCHED_USER_CART", payload: cart}
}

function fetchingUserCart(){
    return (dispatch: any) => {
        fetch(PURCHASES_URL)
        .then(resp => resp.json())
        .then(purchases => {
            // debugger // below line is prone to having errors
            // const userPurchases = purchases.filter(p => p.user_id === currentUser.id)
            const userPurchases = purchases.filter((p: {user_id: number}) => p.user_id === currentUserId)
            const userCart = userPurchases.filter((p: {is_purchased: boolean}) => p.is_purchased === false)
            let total = 0
            // userCart.forEach((p: {course {price: number}}) => total += p.course.price)
            userCart.forEach((p: {course: {price: number}}) => total += p.course.price)

            let currentUserCart = userCart

            dispatch(fetchedUserCart(userCart))
            dispatch(cartTotal(total))
        })
    }
}

function cartTotal(total: number) {
    // total is correct
    return { type: "CART_TOTAL", payload: total };
}

interface itemTs {
    id: number
}

function removingFromCart(item: itemTs){
    return (dispatch: any) => {
    fetch(PURCHASES_URL + `/${item.id}`, {
        method: "DELETE",
        headers: {"Content-Type": "application/json",
        "Accept": "application/json"}
    }).then(resp => resp.json())
    .then(purchase => {
        // console.log(purchase)
        // debugger // below line is prone to errors
        currentUser.purchases = currentUser.purchases.filter((p: {id: number}) => p.id !== purchase.id)
        dispatch(removedFromCart(purchase))
        // dispatch(removedFromCart(currentUser.purchases))
        })
    }
}

function removedFromCart(purchase: object){
    return {type: "REMOVED_FROM_CART", payload: purchase}
}

function fetchedTotalCompanyRevenue(total: number){
    return {type: "FETCHED_TOTAL_REVENUE", payload: total}
}

function totalRevenue(){
    return(dispatch: any) => {
        fetch(COURSES_URL)
        .then(resp => resp.json())
        .then(courses => {
            let total = 0

            const companyCourses = courses.filter((c: {company_id: number}) => c.company_id === currentCompanyId)

            interface cTs {
                // purchases: {
                    // is_purchased: boolean
                // }
                purchases: any[]
                price: number
            }
            const purchasedCourses = companyCourses.filter((c: cTs) => {
            for(let i = 0; i < c.purchases.length; i++){
                if(c.purchases[i].is_purchased === true){
                    total += c.price
                }
            }
            })
            dispatch(fetchedTotalCompanyRevenue(total))
        })
    }
}

interface courseTs {
    id: number
}

function addingToCart(course: courseTs){
    return (dispatch: any) => {
        let alreadyInCartOrPurchased = false
        // for(let i = 0; i < course.users.length; i++){
            // if(course.users[i].id === currentUserId){
                // alreadyInCartOrPurchased = true
                // i = course.users.length
                // alert("You already purchased this course")
                // dispatch(alreadyOwned())
            // }
        // }

        for(let k = 0; k < currentUser.purchases.length; k++){
            if(course.id === currentUser.purchases[k].course_id){
                alreadyInCartOrPurchased = true
                k = currentUser.purchases.length
            }
        }
            if(alreadyInCartOrPurchased === true){
                alert("You have either already purchased this course or it is currently inside your cart")
                dispatch(alreadyOwned())
            }else{
        const obj = {
            course_id: course.id,
            user_id: currentUser.id,
            is_purchased: false,
            course: course, 
            user: currentUser
        }
        fetch(PURCHASES_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json",
            "Accept": "application/json",
        },
            body: JSON.stringify(obj)
        })
        .then(resp => resp.json())
        .then(purchase => {
                currentUser.purchases = [...currentUser.purchases, purchase]
                purchase.course = course
                alert("Added to cart")
                dispatch(addedToCart(purchase))
        })
        }
    }
}

function addedToCart(purchase: object){
    console.log("UPDATED CART", purchase)
    return { 
        type: "ADD_TO_CART", payload: purchase}
}

function alreadyOwned(){
    return {
        type: "ALREADY_OWNED",
    }
}

interface cartTs {
    length: number
    id: number,
    course: {
        id: number
    },
}

function checkingOutCart(cart: Array<cartTs>){
    return (dispatch: any) => {
    let i = 0
    while(i < cart.length){
        let obj = {
            is_purchased: true,
            course: cart[i].course
        }
        fetch(PURCHASES_URL + `/${cart[i].id}`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json",
            "Accept": "application/json"},
            body: JSON.stringify(obj)
        })
        .then(resp => resp.json())
        .then(updated => {
            for(let j = 0; j < cart.length; j++){
                if(updated.course_id === cart[j].course.id){
                    updated.course = cart[j].course
                }
            }
            // dispatch(checkedOutCart(updated))
            dispatch(checkedOutCart())
            window.location.reload()
            // dispatch(gotProfileFetch(currentUser))
        })
        i++
        }
    alert("Cart checkout complete")
    }
}

// function checkedOutCart(updatedPurchase){
function checkedOutCart(){
    return {type: "CHECKOUT_CART", payload: []}
}

function fetchingCompany(email: string, password: string){
    return (dispatch: any) => {
        let obj = {
            email: email,
            password: password
        }
            fetch(COMPANY_LOGIN_URL, {
                method: "POST",
                headers: {
                "Content-Type" : "application/json",
                "Accept" : "application/json",
                },
                body: JSON.stringify(obj)
                }).then(resp => resp.json())
                .then(company => { 
                    if(company.error_message){
                        alert(company.error_message)
                    }else{
                        localStorage.setItem("token", company.token)
                        localStorage.setItem("user_or_company", "company")
                        // currentCompany = company.company
                        currentCompanyId = company.company.id
                        // fetch(COMPANY_URL + `/${currentCompanyId}`) // fetches company courses and purchases
                        // .then(resp => resp.json())
                //         .then(company => {
                            if(!company.status){
                                currentCompany = company.company
                                dispatch(gotCompanyProfileFetch(company.company))
                            }
                // })
            }
        })
    }
}


function fetchedCompany(company: object){
    return {type: "FETCHED_COMPANY", payload: company}
}

function gettingCompanyProfileFetch(){
    return (dispatch: any) => {
            if(localStorage.token && localStorage.user_or_company === "company") {
            fetch(COMPANY_LOGIN_URL, { // fetches company minus courses and purchases
                // method: "GET",
                headers: {"Authenticate": localStorage.token}
            })
            .then(resp => resp.json())
            .then(company => { 
                // currentCompanyId = company.id
                currentCompanyId = company.company.id
                if(company.message || company.company.message){
                    localStorage.removeItem("token")
                }else{
                // fetch(COMPANY_URL + `/${currentCompanyId}`) // fetches company courses and purchases
                // .then(resp => resp.json())
                // .then(company => {
                    currentCompany = company.company
                    dispatch(gotCompanyProfileFetch(company.company))
                // })
                }
            })
        }
    }
}

function gotCompanyProfileFetch(company: object){
    return {type: "GOT_COMPANY_PROFILE_FETCH", payload: company}
}

interface courseInfoTs {
    courseName: string,
    courseDescription: string,
    videoPreview: string,
    price: number,
    duration: string,
    subject: string,
    difficultyLevel: string,
    contentCovered: string,
    picture: string,
    lessonsArray: []
}

function creatingNewCourse(courseInfo: courseInfoTs){
    console.log("before dispatch", courseInfo)
    return (dispatch: any) => {
        let courseObj = {
            name: courseInfo.courseName,
            text_preview: courseInfo.courseDescription,
            video_preview: courseInfo.videoPreview,
            price: courseInfo.price,
            duration: courseInfo.duration,
            subject: courseInfo.subject,
            difficulty_level: courseInfo.difficultyLevel,
            content_covered: courseInfo.contentCovered,
            picture: courseInfo.picture,
            company_id: currentCompanyId,
            lessons: courseInfo.lessonsArray
        }
        fetch(COURSES_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json",
            "Accept": "application/json"},
            body: JSON.stringify(courseObj)
        }).then(resp => resp.json())
        .then(course => {
            // debugger // obscure bug here... not sure how it happened during the dry run of my presentation
            currentCompany.courses.push(course)
            course.company = currentCompany

            newlyCreatedCourse = course
            newlyCreatedCourse.lessons = []
            dispatch(createdNewCompanyCourse(currentCompany))

            

            async function creatingNewLessons(courseInfo: {lessonsArray: any}, course: {id: number}){
                // return async (dispatch) => {
                    
                    interface lessonObjTs {
                        lesson_number: number|string,
                        course_id: number,
                        lesson_name: {
                                courseInfo: {
                                lessonsArray: any[]
                            }
                        },
                        text_content: {
                            courseInfo: {
                                lessonsArray: any[]
                            }
                        },
                        video?: {
                            courseInfo: {
                                lessonsArray: any[]
                            }
                        }
                    }

                    let lessonObj: lessonObjTs
                    for(let i = 0; i < courseInfo.lessonsArray.length; i++){ // [i][0] === lesson name, [i][1] === text content, [i][2] === video, lesson number === [i][i]
                        // post request(s) that happen inside this for loop are somehow acting in an async manner?
                        // if video === "" then obj excludes video
                        let lessonNumber = i + 1
                        console.log(lessonNumber)
                        if(courseInfo.lessonsArray[i][2] === ""){
                            lessonObj = {
                                course_id: course.id,
                                lesson_name: courseInfo.lessonsArray[i][0],
                                text_content: courseInfo.lessonsArray[i][1],
                                // lesson_number: courseInfo.lessonsArray[i][i],
                                lesson_number: lessonNumber
                            }
                            }else{
                                lessonObj = {
                                    course_id: course.id,
                                    lesson_name: courseInfo.lessonsArray[i][0],
                                    text_content: courseInfo.lessonsArray[i][1],
                                    video: courseInfo.lessonsArray[i][2],
                                    // lesson_number: courseInfo.lessonsArray[i][i],
                                    lesson_number: lessonNumber
                                }
                            }

                            if(lessonObj.lesson_number === ""){ // previously final lesson number was just "". this code gives it the correct number
                                lessonObj.lesson_number = courseInfo.lessonsArray[i][i-1]
                            }
                            console.log("lessonObj", lessonObj)
                            const settings = {
                                method: 'POST',
                                headers: {
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(lessonObj)
                            }
                                const fetchResponse = await fetch(LESSON_URL, settings)
                                const data = await fetchResponse.json();
                                newlyCreatedCourse.lessons = [...newlyCreatedCourse.lessons, data]
                            dispatch(createdNewLesson(data))
                        }
                    dispatch(createdNewCourse(newlyCreatedCourse))
                }
            creatingNewLessons(courseInfo, course)
            })
        }
    }

function createdNewLesson(lesson: object){
    return {type: "CREATED_NEW_LESSON", payload: lesson}
}

function createdNewCourse(course: object){
    return {type: "CREATED_NEW_COURSE", payload: course}
}

function createdNewCompanyCourse(currentCompany: object){
    return {type: "CREATED_NEW_COMPANY_COURSE", payload: currentCompany}
}

function selectingCourseLessons(id: number){
    return (dispatch: any) => {
        fetch(COURSES_URL + `/${id}`)
        .then(resp => resp.json())
        .then(course => {
            console.log("selectingCourseLessons", course)
            dispatch(selectedCourseLessons(course.lessons))
        })
    }
}

function selectedCourseLessons(lessons: object){
    return {type: "FETCHED_LESSONS", payload: lessons}
}

function selectingCourse(id: number){
    return (dispatch: any) => {
        fetch(COURSES_URL + `/${id}`)
        .then(resp => resp.json())
        .then(course => {
            dispatch(selectedCourse(course))
        })
    }
}

function selectedCourse(course: object){
    return {type: "EDIT_SELECTED_COURSE", payload: course}
}

function selectingLesson(lessonId: number){
    return (dispatch: any) => {
        // console.log("selecting", lessonId)
        fetch(LESSON_URL + `/${lessonId}`)
        .then(resp => resp.json())
        .then(lesson => {
            dispatch(selectedLesson(lesson))
        })
    }
}

function selectedLesson(lesson: object){
    return {type: "SELECTED_LESSON", payload: lesson}
}

interface courseIdAndLessonsTs {
    courseId: number,
    lessons: Array<{
        length: number,
        id: number
    }>
}

function deletingCourse(courseIdAndLessons: courseIdAndLessonsTs){
    return (dispatch: any) => {
        fetch(COURSES_URL + `/${courseIdAndLessons.courseId}`, {
            method: "DELETE",
            headers: {"Content-Type": "application/json",
            "Accept": "application/json"}
        }).then(resp => resp.json())
        .then(course => {
            console.log(course)
            dispatch(deletedCourse(course))
            let updatedCourses = currentCompany.courses.filter((course: {id: number}) => {
                return course.id !== courseIdAndLessons.courseId
            })
            
            for(let i = 0; i < courseIdAndLessons.lessons.length; i++){
                fetch(LESSON_URL + `/${courseIdAndLessons.lessons[i].id}`, {
                    method: "DELETE",
                    headers: {"Content-Type": "application/json",
                    "Accept": "application/json"}
                })//.then(resp => resp.json())
                //.then(lesson => {
                //})
            }
            // dispatch(deletedCourse(updatedCourses))
            currentCompany.courses = updatedCourses
            dispatch(deletedCompanyCourse(currentCompany))
        })
    }
}

function deletedCompanyCourse(currentCompany: object){
    return {type: "DELETED_COURSE_FROM_COMPANY", payload: currentCompany}
}

function deletedCourse(course: object){
    return {type: "DELETED_COURSE", payload: course}
}

interface editingCourseInfoTs {
    name: string,
    textPreview: string,
    videoPreview: string,
    price: number,
    duration: string,
    subject: string,
    difficultyLevel: string,
    picture: string,
    courseId: number,
    contentCovered: string|Array<string>,
}

function editingCourse(courseInfo: editingCourseInfoTs){
// function editingCourse(courseInfo: any){
    return (dispatch: any) => {
        // let contentCovered
        if(typeof(courseInfo.contentCovered) === "string"){
            courseInfo.contentCovered = [courseInfo.contentCovered]
            // contentCovered = [courseInfo.contentCovered]
        }else if(courseInfo.contentCovered.includes("")){
            courseInfo.contentCovered = courseInfo.contentCovered.filter((i: string) => i !== "")
            // contentCovered = courseInfo.contentCovered.filter((i: string) => i !== "")
        }
        let obj = {
            name: courseInfo.name,
            text_preview: courseInfo.textPreview,
            video_preview: courseInfo.videoPreview,
            price: courseInfo.price,
            duration: courseInfo.duration,
            subject: courseInfo.subject,
            difficulty_level: courseInfo.difficultyLevel,
            content_covered: courseInfo.contentCovered,
            // content_covered: contentCovered,
            picture: courseInfo.picture,

            company_id: currentCompanyId
        }
        fetch(COURSES_URL + `/${courseInfo.courseId}`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json",
            "Accept": "application/json"},
            body: JSON.stringify(obj)
        }).then(resp => resp.json())
        .then(course => {
            // dispatch(editedCourse(course))

            window.location.reload()
        })
    }
}

function editedCourse(course: object){
    return {type: "EDITED_COURSE", payload: course}
}

interface userInfoTs {
    name: string,
    email: string,
    password: string,
    descriptors: any // not number to avoid array not being read as an array
}

function creatingNewUser(userInfo: userInfoTs){
    return (dispatch: any) => {
        let floatArray: Array<number> = userInfo.descriptors[0]
        let array = Array.from(floatArray)
        let obj = {
            user: { // must be nested to avoid "password can't be blank" in backend create action
                name: userInfo.name,
                email: userInfo.email, 
                password: userInfo.password,
                password_confirmation: userInfo.password,
                // face: [-0.12152376770973206,0.11854128539562225,0.0393778532743454,-0.023120634257793427,-0.037513650953769684,-0.09053827077150345,-0.11419517546892166,-0.13911336660385132,0.07012901455163956,-0.057273540645837784,0.28564974665641785,-0.09310808032751083,-0.21844975650310516,-0.05255025625228882,-0.10366261005401611,0.11725335568189621,-0.18084987998008728,-0.1381365805864334,-0.007394472602754831,-0.050837475806474686,0.15679849684238434,0.024266080930829048,0.0036879300605505705,0.0785139873623848,-0.13933144509792328,-0.24035976827144623,-0.15920160710811615,-0.0776456743478775,0.06722988933324814,-0.08620472997426987,-0.09371355175971985,0.009770920500159264,-0.20071813464164734,-0.09313060343265533,0.0506620779633522,0.09400037676095963,0.026307962834835052,-0.04036227613687515,0.16182976961135864,-0.001182794338092208,-0.1133217066526413,0.038698554039001465,0.0287659652531147,0.27714863419532776,0.17105983197689056,0.09292809665203094,-0.04402323067188263,-0.11895433813333511,0.03200376778841019,-0.22613510489463806,0.15720227360725403,0.18627001345157623,0.10663449019193649,0.11044519394636154,0.009195166639983654,-0.17776915431022644,0.033483169972896576,0.12230435013771057,-0.15409284830093384,0.055764954537153244,0.051198385655879974,-0.047342296689748764,0.013217926025390625,-0.07595819979906082,0.1655624508857727,0.08974127471446991,-0.1290493607521057,-0.13685832917690277,0.09742940217256546,-0.1473100781440735,-0.09445206075906754,0.06530201435089111,-0.11342797428369522,-0.17682887613773346,-0.3583138585090637,0.05802017077803612,0.41180938482284546,0.1474955976009369,-0.22886085510253906,0.08116909116506577,-0.013438625261187553,-0.05012163892388344,0.09851820766925812,0.05249416083097458,-0.10230779647827148,0.0708698034286499,-0.13612501323223114,0.03168820962309837,0.1596999168395996,0.003119773929938674,-0.06412478536367416,0.26823654770851135,-0.043753091245889664,0.11701816320419312,0.13730837404727936,0.11926731467247009,-0.04860799387097359,-0.06266523152589798,-0.12614227831363678,-0.014313217252492905,0.03720659017562866,-0.061671484261751175,-0.08735449612140656,0.14086458086967468,-0.1287159025669098,0.11032436788082123,-0.008991996757686138,-0.0010066446848213673,-0.09456511586904526,-0.03189706802368164,-0.12734508514404297,-0.028363142162561417,0.15781927108764648,-0.24941053986549377,0.14651140570640564,0.1788005381822586,0.07177681475877762,0.13844794034957886,0.14368104934692383,0.03548673167824745,-0.0059281643480062485,-0.06643827259540558,-0.1910407990217209,-0.04936443641781807,0.09598109126091003,-0.04356467351317406,0.07746876776218414,0.05128036066889763]
                // face: userInfo.descriptors[0]
                face: array
            }
        }
        fetch(USER_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json",
                "Accept": "application/json"},
            body: JSON.stringify(obj)
        }).then(resp => resp.json())
        .then(user => {
            localStorage.setItem("token", user.token)
            localStorage.setItem("user_or_company", "user")
            currentUserId = user.id
            dispatch(gettingProfileFetch())
            // fetch(USER_URL + `/${currentUserId}`)
            // fetch(LOGIN_URL + `/${currentUserId}`)
            // .then(resp => resp.json())
            // .then(user => {
                // dispatch(fetchingUser(user.email, user.password))
                // dispatch(gettingProfileFetch())
                // gettingProfileFetch()
            // })
            // window.location.reload()
        })
    }
}

interface companyInfoTs {
    name: string,
    email: string,
    password: string
}

function creatingNewCompany(companyInfo: companyInfoTs){
    return (dispatch: any) => {
        let obj = {
            company: {// must be nested to avoid "password can't be blank" in backend create action
            name: companyInfo.name,
            email: companyInfo.email,
            password: companyInfo.password,
            password_confirmation: companyInfo.password
            }
        }
        fetch(COMPANY_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json",
                "Accept": "application/json"},
            body: JSON.stringify(obj)
        }).then(resp => resp.json())
        .then(company => {
            localStorage.setItem("token", company.token)
            localStorage.setItem("user_or_company", "company")
            currentCompanyId = company.id
            dispatch(gettingCompanyProfileFetch())
        })
    }
}

function fetchingAllUsers(){
    return (dispatch: any) => {
        fetch(USER_URL)
        .then(resp => resp.json())
        .then(users => {
            dispatch(fetchedAllUsers(users))
        })
    }
}

function fetchedAllUsers(users: object){
    return {type: "FETCHED_ALL_USERS", payload: users}
}

function openingEnlargedCourse(course: {id: number}){
    return (dispatch: any) => {
        fetch(COURSES_URL + `/${course.id}`)
        .then(resp => resp.json())
        .then(course => {
            dispatch(fetchedEnlargedCourse(course))
        })
    }
}

function closeEnlargedCourse(){
    return { type: "FETCHED_ENLARGED_COURSE", payload: false}
}

function fetchedEnlargedCourse(value: object){ // I think it's object. otherwise probably string
    return { type: "FETCHED_ENLARGED_COURSE", payload: value }
}

function changeSearchText(value: string) {
    return { type: "CHANGE_SEARCH_TEXT", payload: value };
}

function sortByDuration(value: string){
    return { type: "SORTED_BY_DURATION", payload: value }
}

function sortByPrice(value: string){
    const priceRangeArr = value.replace("$", "").replace("$", "").split("-")
    let priceRangeArrToInteger = [parseInt(priceRangeArr[0]), parseInt(priceRangeArr[1])]
    return { type: "SORTED_BY_PRICE", payload: priceRangeArrToInteger}
}

function sortByDifficultyLevel(value: object){
    return { type: "SORTED_BY_DIFFICULTY_LEVEL", payload: value }
}

function clickedBackButton(){
    return { type: "CLICKED_BACK_BUTTON", payload: []}
}

export { selectingCourse, clickedBackButton, closeEnlargedCourse, openingEnlargedCourse, createdNewLesson, selectingLesson, sortByDuration, sortByPrice, sortByDifficultyLevel, changeSearchText, fetchingAllUsers, creatingNewUser, creatingNewCompany, editingCourse, selectingCourseLessons, deletingCourse, creatingNewCourse, editingCompanyInfo, editingUserInfo, removingFromCart, totalRevenue, fetchingCompany, logoutUser, fetchingCourses, fetchingUser, fetchingUserCart, cartTotal, addingToCart, checkingOutCart, gettingProfileFetch, gettingCompanyProfileFetch }