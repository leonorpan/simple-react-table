import React from 'react';
import './App.css';
import Intents from './data/intents.json'

// https://blog.bitsrc.io/build-a-simple-modal-component-with-react-16decdc111a6
class AppModal extends React.Component {
  constructor(props) {
    super(props)

    this.onClose = this.onClose.bind(this)
  }

  onClose(e) {
    this.props.onClose && this.props.onClose(e)
  }

  render() {
    if(!this.props.show){
      return null
    }

    return (
      <div className="AppModal">
        <h1>You Selected:</h1>
        <div className="content">{this.props.children}</div>
        <div className="actions">
          <button
            id="centered-toggle-button"
            onClick={e => {
              this.onClose(e)
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)

    const intents = Intents.reduce((acc, item) => {
      acc[item.id] = false
      return acc
    },{})


    this.state = Object.assign({},{
      saved: false
    }, {
      intents,
    })

    this.handleInputChange = this.handleInputChange.bind(this)
    this.onSelectAll = this.onSelectAll.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
  }

  handleInputChange(event) {
    const target = event.target
    const value = target.checked
    const name = target.name

    this.setState({
      intents: {
        ...this.state.intents,
        [name]: value
      }
    }, () => {
      console.log(this.state.intents)
    })
  }

  toggleModal(e) {
    this.setState({
      show: !this.state.show
    })
  }

  onSelectAll(event) {
    const target = event.target
    const value = target.checked
    const intents = Intents.reduce((acc, item) => {
      acc[item.id] = value
      return acc
    },{})

    this.setState({
      intents,
    })
  }

  render() {
    return (
      <main className="App">
        <header className="intent-header">
        </header>
        <section className="intent-section">
          <div className="intent-section-header">
            <p className="intent-table-caption">
              Choose the Replies your AI will respond with :)
            </p>
            <button className="save-button" onClick={this.toggleModal}>Select</button>
          </div>
          <table className="intent-table">
            <thead>
              <tr>
                <th><input type="checkbox" onChange={this.onSelectAll} /></th>
                <th>Customer action:</th>
                <th>AI Reply:</th>
              </tr>
            </thead>
            <tbody>
            {Intents.map((i) => {
              return <tr key={i.id}>
              <td>
                <input 
                  type="checkbox"
                  name={i.id}
                  checked={this.state.intents[i.id]}
                  onChange={this.handleInputChange} 
                />
              </td>
              <td data-tooltip=
              {i.description}
              >
                  <b>{i.name}</b>
                  {
                    i.trainingData.messages && <ul>
                    {i.trainingData.messages.map((td) => {
                      return <li key={td.id} className="intent-example">{td.text}</li>
                    })}
                  </ul>
                  }
                  {
                    i.trainingData.expressions && <ul>
                    {i.trainingData.expressions.map((td) => {
                      return <li key={td.id} className="intent-example">{td.text}</li>
                    })}
                  </ul>
                }
              </td>
              <td><span>{i.reply.text}</span></td>
              </tr>
              }
            )}
            </tbody>
          </table>
        </section>
        <AppModal onClose={this.toggleModal} show={this.state.show} >
          <ul>
            {Intents.filter(({ id }) => {
              return this.state.intents[id]
            }).map((intent) => {
              return <li key={intent.id}>{intent.name}</li>
            })
          }
          </ul>
        </AppModal>
      </main>
    )
  }
}

export default App
