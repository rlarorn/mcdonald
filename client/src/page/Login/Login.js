import React, { useState, useRef, useEffect } from 'react';
import './Login.scss';
import axios from 'axios';
import { API_URL } from '../../config/contansts';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from "recoil";
import { loginState } from "../../recoil/atoms/State";

function Login() {
	const [isLabelVisibleId, setIsLabelVisibleId] = useState(false);
	const [isLabelVisiblePwd, setIsLabelVisiblePwd] = useState(false);
	const [islogin, setIslogin] = useRecoilState(loginState); //useState와 거의 비슷한 사용법
	const inputRefId = useRef(null);
	const inputRefPwd = useRef(null);
	const navigate = useNavigate();

	/** 로그인 */
	const onSubmitLogin = async (e) => {
		e.preventDefault();
		const email = e.target.email.value
		const pwd = e.target.pwd.value

		if( email !== "" && pwd !== ""){
			console.log(email);
			axios.post(
				`${API_URL}/user/login`,
				{email, pwd},
				{ withCredentials: true }
			)
			.then(() =>{
				alert("로그인성공!");
				setIslogin(true);
				navigate('/');  
			})
			.catch(err =>{
				console.error(err);
			})
		}else{
			return alert("전부 입력해주세요");
		}
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			// 입력 필드 외부를 클릭하면 라벨을 숨깁니다.
			if (
				inputRefId.current &&
				!inputRefId.current.contains(event.target) &&
				inputRefPwd.current &&
				!inputRefPwd.current.contains(event.target)
			) {
				const inputValueId = inputRefId.current.value.trim();
				const inputValuePwd = inputRefPwd.current.value.trim();

				// 입력 필드에 값이 있는 경우 라벨을 보이게 합니다.
				setIsLabelVisibleId(!!inputValueId);
				setIsLabelVisiblePwd(!!inputValuePwd);
			}
		};

		// 이벤트 리스너 등록
		document.addEventListener('mousedown', handleClickOutside);

		// 컴포넌트가 언마운트될 때 이벤트 리스너 제거
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [inputRefId, inputRefPwd]);

	const handleInputFocus = (inputType) => {
		if (inputType === 'id') {
			setIsLabelVisibleId(true);
		} else if (inputType === 'pwd') {
			setIsLabelVisiblePwd(true);
		}
	};

	const handleInputBlur = (inputType) => {
	const inputValue = inputType === 'id' ? inputRefId.current.value : inputRefPwd.current.value;

	// 만약 입력 필드가 비어있다면, 다시 라벨을 숨길 수 있습니다.
	if (!inputValue.trim()) {
		if(inputType === 'id') {
			setIsLabelVisibleId(false);
		}else if(inputType === 'pwd') {
			setIsLabelVisiblePwd(false);
		}
	}
	};
	

	return (
	<div className="Login">
		<form id='login-form' onSubmit={onSubmitLogin}>
			<h1>계정에 로그인</h1>
			<ul id='login-input'>
				<li className="input-li">
					<label className={isLabelVisibleId ? '' : 'hidden'}>아이디(이메일주소)</label>
					<input
						ref={inputRefId}
						type="text"
						id="email"
						placeholder="예) abc@gmail.com"
						onFocus={() => handleInputFocus('id')}//focus 되었을때
						onBlur={() => handleInputBlur('id')}//focus 가 해제되었을때
					/>
				</li>
				<li className="input-li">
					<label className={isLabelVisiblePwd ? '' : 'hidden'}>비밀번호</label>
					<input
						ref={inputRefPwd}
						type="password"
						id="pwd"
						placeholder="비밀번호"
						onFocus={() => handleInputFocus('pwd')}
						onBlur={() => handleInputBlur('pwd')}
					/>
				</li>
			</ul>
			<li><a href="/">비밀번호를 잊어버렸습니까?</a></li>
			<li><button id='login-btn' type='submit'>계정에 로그인</button></li>
			<li id='login-footer'>
				<span>Copyright © 2023 McDonald's</span>
				<a href="/">개인정보 처리방침</a>
				<a href="/">콘택트 렌즈</a>
			</li>
		</form>
	</div>
	);
}

export default Login;
