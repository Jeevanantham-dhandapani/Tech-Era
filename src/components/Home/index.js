import {Component} from 'react'
import {Link} from 'react-router-dom'
import Header from '../Header'
import Loader from '../Loader'
import './index.css'

const apiStatusConst = {
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
  initial: 'INITIAL',
}

class Home extends Component {
  state = {coursesList: [], apiStatus: apiStatusConst.initial}

  componentDidMount() {
    this.getCourseDetails()
  }

  getCourseDetails = async () => {
    this.setState({apiStatus: apiStatusConst.inProgress})

    const response = await fetch('https://apis.ccbp.in/te/courses')

    if (response.ok) {
      const data = await response.json()

      const formattedData = data.courses.map(eachCourse => ({
        id: eachCourse.id,
        name: eachCourse.name,
        logoUrl: eachCourse.logo_url,
      }))

      this.setState({
        coursesList: formattedData,
        apiStatus: apiStatusConst.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConst.failure})
    }
  }

  renderSuccessView = () => {
    const {coursesList} = this.state
    return (
      <div className="bg-container">
        <h1 className="home-heading">Courses</h1>
        <ul className="courses-list-container">
          {coursesList.map(each => (
            <li className="course-list" key={each.id}>
              <Link to={`/courses/${each.id}`} className="link-style">
                <img src={each.logoUrl} alt={each.name} />
                <p className="course-name">{each.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure bg-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/tech-era/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
      <p className="failure-view-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        onClick={this.getCourseDetails}
        className="retry-btn"
      >
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div className="loader bg-container" data-testid="loader">
      <Loader />
    </div>
  )

  renderMethod = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConst.success:
        return this.renderSuccessView()
      case apiStatusConst.inProgress:
        return this.renderLoader()
      case apiStatusConst.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="home-main-bg-container">
        <Header />
        {this.renderMethod()}
      </div>
    )
  }
}
export default Home
