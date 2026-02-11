import {Component} from 'react'
import Header from '../Header'
import Loader from '../Loader'
import './index.css'

const apiStatusConst = {
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
  initial: 'INITIAL',
}

class ItemDetails extends Component {
  state = {courseDetailList: {}, apiStatus: apiStatusConst.initial}

  componentDidMount() {
    this.getItemDetails()
  }

  getItemDetails = async () => {
    this.setState({apiStatus: apiStatusConst.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const response = await fetch(`https://apis.ccbp.in/te/courses/${id}`)
    const data = await response.json()

    if (response.ok) {
      const formattedData = {
        id: data.course_details.id,
        name: data.course_details.name,
        description: data.course_details.description,
        imageUrl: data.course_details.image_url,
      }
      console.log(formattedData)
      console.log(data)
      this.setState({
        courseDetailList: formattedData,
        apiStatus: apiStatusConst.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConst.failure})
    }
  }

  renderSuccessView = () => {
    const {courseDetailList} = this.state
    const {imageUrl, name, description} = courseDetailList
    return (
      <div className="success">
        <div className="card-item-details">
          <img src={imageUrl} alt={name} className="Item-detail-image" />
          <div className="description-container">
            <h1 className="course-detail-name">{name}</h1>
            <p className="course-detail-description">{description}</p>
          </div>
        </div>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="item-detail-failure bg-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/tech-era/failure-img.png"
        alt="failure view"
        className="item-detail-failure-image"
      />
      <h1 className="item-detail-failure-view-heading">
        Oops! Something Went Wrong
      </h1>
      <p className="item-detail-failure-view-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        onClick={this.getItemDetails}
        className="item-detail-retry-btn"
      >
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div className="item-detail-loader bg-container" data-testid="loader">
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
      <div className="course-detail-main-bg-container">
        <Header />
        {this.renderMethod()}
      </div>
    )
  }
}
export default ItemDetails
