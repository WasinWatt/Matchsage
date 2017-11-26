import React from 'react';
import { Row,Col,Button } from 'antd';
import {connect} from 'react-redux';
import {CustomerActions} from 'actions/CustomerActions';
import * as JWT from 'jwt-decode';

class ReservationHistory extends React.Component{

  componentDidMount(){
    this.props.fetchReservationHistory(JWT(localStorage.getItem('user')).user_id);
  }

  render(){
    return <div style={{paddingLeft:'24px',paddingRight:'24px'}}>
      <h1 style={{marginBottom:'24px'}}>ประวัติการจอง</h1>
      {this.props.reservationHistory?this.props.reservationHistory.length>0?this.props.reservationHistory.map((reservation)=>{
        return <Row gutter={24} style={{paddingBottom:'24px',marginLeft:'0px',marginRight:'0px'}}>
          <Col span={10}>
            <img src="../images/banner.jpg" style={{width:'100%',maxHeight:'114px'}}/>
          </Col>
          <Col span={14} style={{textAlign:'left'}}>
            <h1 style={{fontWeight:'bold'}}>ร้าน {reservation.service_name}</h1>
            <Row style={{marginTop:'12px'}}>
              <Col span={10}>
                <div style={{fontSize:20}}>
                  <div style={{marginBottom:'6px'}}>วันที่จอง: {reservation.date_created}</div>
                  ช่องทางการชำระเงิน: </div>
              </Col>
              <Col span={12}>
                <div style={{fontSize:20}}>
                  <div style={{marginBottom:'6px'}}>วันที่ใช้บริการ: {reservation.date_reserved}</div>
                </div>
                <Button style={{marginRight:'12px'}} onClick={()=>this.props.informReceipt(reservation.reserve_id)}>ดูใบเสร็จ</Button>
                <Button onClick={()=>this.props.downloadReceipt(reservation.reserve_id)}>ดาวน์โหลดใบเสร็จ</Button>
              </Col>
            </Row>
          </Col>
        </Row>
      }):<h1>ท่านยังไม่เคยจองบริการใดๆ</h1>:null}
    </div>
  }
}

function mapStateToProps(state){
	return {
		reservationHistory: state.ServiceRecieverReducer.reservationHistory
	}
}

function mapDispatchToProps(dispatch){
	return {
		fetchReservationHistory: (customer_id)=>{
      dispatch(CustomerActions.informReservationHistory(customer_id))
    },
    informReceipt: (reserve_id)=>{
      dispatch(CustomerActions.informBillDetail(reserve_id))
    },
    downloadReceipt: (reserve_id)=>{
      dispatch(CustomerActions.downloadBillDetail(reserve_id))
    }
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ReservationHistory);