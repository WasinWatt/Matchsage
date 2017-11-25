import React from 'react';
import { Row, Col, Button, Menu, Table, Modal} from 'antd';
import {connect} from 'react-redux';
import {CustomerActions, OwnerActions} from '../../actions';
import NotFound from '../NotFound';
import styled from 'styled-components';
import { Carousel } from 'antd';
import { Avatar } from 'antd';
import EditServiceModal from '../Common/Modal/EditServiceModal';
import AddEmployeeModal from '../Common/Modal/AddEmployeeModal';
import MapComponent from '../../components/Service/MapComponent';


const H1 = styled.h1`
	text-align:left;
	color:#402900
`

const P = styled.p`
	text-align:left;
	text-indent:30px;
	color:#402900
`

class OwnerServiceDetail extends React.Component{

	constructor(props){
		super(props);
		this.state = {			
			current : 'overall',
			currentWindow: 'detail',
			isEditServiceModalActive: false,
			isAddEmployeeModalActive: false,
			isReserveModalActive: false,
			reserveModaldata: []
		};		
	}
	
	handleTabClick = (e) => {
		this.setState({
			current: e.key,
		});
	}

		handleSidebarClick = (e) => {
		if (e.key == 'edit')
			this.toggleEditServiceModal(true)
		else if (e.key == 'add')
			this.toggleAddEmployeeModal(true)
		else if (e.key == 'back')
			this.props.history.push('/owner')
		else
		this.setState({
			currentWindow: e.key,
		});

 	 }
	componentDidMount(){
		this.props.loadService(this.props.match.params.id);
		this.props.loadHistory(this.props.match.params.id);
	}

	toggleReserveModalModal(modalValue){
		this.setState({isReserveModalActive: modalValue})
	}

	toggleEditServiceModal(modalValue){
		this.setState({isEditServiceModalActive: modalValue})
	}

	toggleAddEmployeeModal(modalValue){
		this.setState({isAddEmployeeModalActive: modalValue})
	}

	aftersubmit = () => {		
		this.setState({isEditServiceModalActive: false, isAddEmployeeModalActive:false})
		this.props.loadService(this.props.match.params.id);			
	}
	
	renderServiceDetail = ()=>{
		return(
			<div>				
				<H1>ชื่อร้าน {this.props.serviceReducer.service.service_name}</H1>
				<Row gutter={16} style={{marginBottom:'10px'}}>
					<Col span={12}>
						<Carousel autoplay>
							<div><h1 style={{color:'white'}}>Pic1</h1></div>
							<div><h1 style={{color:'white'}}>Pic2</h1></div>
							<div><h1 style={{color:'white'}}>Pic3</h1></div>
							<div><h1 style={{color:'white'}}>Pic4</h1></div>
						</Carousel>
					</Col>
					<Col span={12}>
						<MapComponent isMarkerShown
						/>
					</Col>				
				</Row>				
				<Row>
					<Menu
						onClick={this.handleTabClick}
						selectedKeys={[this.state.current]}
						mode="horizontal"
						style={{marginBottom:'10px',display:'inline-block',float:'left',color:'#402900'}}
					>
						<Menu.Item key="overall">
							ข้อมูลทั่วไป
						</Menu.Item>
						<Menu.Item key="employee" style={{}}>
							พนักงาน
						</Menu.Item>
					</Menu>
					</Row>
					{this.state.current==='overall'?<div>
						<H1>คำอธิบายร้าน</H1>
						<P>บลา บลา บลา</P>
						<H1>เจ้าของ</H1>
						<P>{this.props.serviceReducer.ownerDetail.first_name} {this.props.serviceReducer.ownerDetail.last_name}</P>
						<H1>ที่อยู่</H1>
						<P>{this.props.serviceReducer.service.address}<br/></P>
						<P>เบอร์ {this.props.serviceReducer.service.contact_number}</P>
						<P>อีเมล์ {this.props.serviceReducer.ownerDetail.email}</P>
						<H1>คะแนน</H1>
						<P>{this.props.serviceReducer.service.rating}</P>
						<H1>ราคา</H1>
						<P>{this.props.serviceReducer.service.price_per_hour}</P>
					</div>
					:
					<div>
						<Row >
							<Col span={12}>
								{this.props.serviceReducer.employees.employees.map((employee,index)=>{return index%2===0?<div><div><Avatar shape="square" size="large" icon="user" /></div>ชื่อ {employee.first_name} {employee.last_name}<br/>คะแนน {employee.rating}</div>:null})}
							</Col>
							<Col span={12}>
								{this.props.serviceReducer.employees.employees.map((employee,index)=>{return index%2===1?<div><div><Avatar shape="square" size="large" icon="user" /></div>ชื่อ {employee.first_name} {employee.last_name}<br/>คะแนน {employee.rating}</div>:null})}
							</Col>
						</Row>
					</div>
					}					
				</div>			
		);
	}

	onReserveClick = (record, index) => {
		console.log(record)
		this.toggleReserveModalModal(true)
		this.setState({reserveModaldata: record})
	}

	renderServiceHistory = () =>{

		const columns = [{
			title: 'customer_id',
			dataIndex: 'customer_id',
			key: 'customer_id',
		  }, {
			title: 'employee_id',
			dataIndex: 'employee_id',
			key: 'employee_id',
		  }, {
			title: 'date',
			dataIndex: 'date',
			key: 'date',
		  }, {
			title: 'paid_status',
			dataIndex: 'paid_status',
			key: 'paid_status',
		  }];	
		  
		return(
			this.props.History.length > 0 ?
			<Table className="tableja"
			dataSource={this.props.History}
			columns={columns}	
			onRowClick={this.onReserveClick}		  
			pagination={false}/>:<div>no reservetions for this sevice now...</div>
		)
	}

	render(){
		let loaded = this.props.serviceReducer.service;
		return (
			loaded?this.props.serviceReducer.service.service_id?
			<div style={{color:'#402900'}}>				
				<Row type="flex" justify="space-between" gutter={48} style={{marginBottom:'20px',marginTop:'20px',paddingLeft:'48px',paddingRight:'48px'}}>
					<Col span={5} style={{paddingLeft:'0px'}}>
						<Menu			
							onClick={this.handleSidebarClick}								
							mode="inline"
							selectedKeys={[this.state.currentWindow]}
							style={{color:'#402900'}}>
							<Menu.Item key="detail">
								ข้อมูลร้าน
							</Menu.Item>
							<Menu.Item key="history">
								ข้อมูลการใช้บริการ
							</Menu.Item>	
							<Menu.Item key="edit">
								แก้ไขข้อมูลร้าน
							</Menu.Item>
							<Menu.Item key="add">
								เพิ่มพนักงาน
							</Menu.Item>	
							<Menu.Item key="back">
								<Button type="primary" >
									<span>กลับสู่หน้าหลัก</span>
								</Button>	
							</Menu.Item>													
						</Menu>													
					</Col>

					<Col span={19} > 											
						{(this.state.currentWindow == 'detail') ?
						<Col style={{backgroundColor:'#FFF8EB',padding:'20px'}}>
							{this.renderServiceDetail()}
						</Col>:	this.renderServiceHistory()}						
					</Col>					
				</Row>

				<EditServiceModal 
					modalState={this.state.isEditServiceModalActive} 
					onCloseModal={()=>this.toggleEditServiceModal(false)}	
					editService = {loaded}									
					aftersubmit = {this.aftersubmit}
				/>

				<AddEmployeeModal
					modalState={this.state.isAddEmployeeModalActive} 
					onCloseModal={()=>this.toggleAddEmployeeModal(false)}	
					editService = {loaded}									
					aftersubmit = {this.aftersubmit}
				/>

				<Modal
					title="Reserveeee"
					visible={this.state.isReserveModalActive}
					closable = {false}
					footer={[
						<Button key="OK" 
						size="large" 
						type = "primary"
						onClick = {() => this.toggleReserveModalModal(false)}>
						OK</Button>			
					  ]}
					>	
						{JSON.stringify(this.state.reserveModaldata)}
				</Modal>

			</div>:<NotFound/>
			:null
		)
	}
}

function mapStateToProps(state){
	return {
		serviceReducer: state.service,
		History: state.OwnerReducer.History
	}
}

function mapDispatchToProps(dispatch){
	return {
		loadService: (id)=>{
			dispatch(CustomerActions.fetchService(id))
		},
		loadHistory: (id)=>{
			dispatch(OwnerActions.fetchServiceHistory(id))
		}
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(OwnerServiceDetail);