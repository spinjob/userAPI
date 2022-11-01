import React, {Component} from 'react'
import CreateActionForm from './CreateActionForm.js';
import CreateTriggerForm from './CreateTriggerForm.jsx';
import ConfirmWorkflow  from './ConfirmWorkflow.js';

export default class SelectAction extends Component {

    constructor(props) {
        super(props);

        this.state =  {
            step: 1,
            trigger: '',
            actions: [],
            projectId: this.props.projectId
        }

    }

    prevStep = () => {
        const {step} = this.state;
        this.setState({
            step: step - 1
        })
    }

     nextStep = () => {
        const {step} = this.state;
        this.setState({
            step: step + 1
        })
    }

    handleChange = input => e => {
            this.setState({[input]: e.target.value})

    }

    render() {
        const {step} = this.state;   
        switch(step) {
            case 1: 
                return (
                    <div>
                        <CreateTriggerForm 
                        nextStep={this.nextStep}
                        handleChange={this.handleChange}
                        projectId={this.props.projectId}
                        handleNewNode={this.props.handleNewNode}
                        isDisabled={false} />
                    </div>

                )
            case 2:
                return (
                    <div>
                        <CreateTriggerForm 
                        nextStep={this.nextStep}
                        handleChange={this.handleChange}
                        isDisabled={true} />
                        <CreateActionForm 
                        nextStep={this.nextStep}
                        prevStep={this.prevStep}
                        projectId={this.props.projectId}
                        handleNewNode={this.props.handleNewNode}/>
                    </div>
                )
            case 3:
                return (
                    <div>
                    <CreateTriggerForm 
                    nextStep={this.nextStep}
                    handleChange={this.handleChange}
                    isDisabled={true} />
                    <CreateActionForm 
                    nextStep={this.nextStep}
                    prevStep={this.prevStep}
                    projectId={this.props.projectId}
                    handleNewNode={this.props.handleNewNode} 
                    isDisabled={true}/>
                    <ConfirmWorkflow 
                    prevStep={this.prevStep}
                    projectId={this.props.projectId}
                    createWorkflow={this.props.createWorkflow}
                    />

                    </div>
                )
            default:
                
        }
    }
}