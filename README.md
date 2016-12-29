JQuery Library LazyDuck

JQuery 기반 잦은 기능 코드 단축을 목표로함

Dependency :
JQuery 1.x / 2.x
underscore.js

구성 :
1. JQuery 확장 코드
2. LDForm
3. LDArea
4. LDData

예 :

html
----
<xmp>
<form id="formCreate" class="LDForm">
	<input type="text" name="search" />
</form>
</xmp>

js
----
$(function() {
	LD.invoke();
	
	LD.formCreate.search = 'The search value';
	console.log(LD.formCreate.search);
});

console
----
'The search value'

Live Example
http://dm1430720111901.fun25.co.kr/lazyduck/

2016/11/22 업데이트
1. LDAttribute 생성, data-xxx={json} 형태의 문자열을 파싱하기 위함
현재 내부적으로만 사용중

LDAttr.parseKV('{"a": "b"}');

2. LDForm preventSubmit 기능 추가
더이상 submit을 하지 못하게 할때 사용함
LDForm.preventSubmit();
LDForm.allowSubmit();

3. LDArea data-template 찾지 못한경우 error

4. LDArea.show LDArea.hide 추가
show(true); show(false); hide(); 모두 동작함

5. LDD.empty 추가
data 없이 랜더링 하기 위함

6. submitConfirm data-before-submit 추가
해당 기능 추가

7. LDAssert 추가
throw 기능으로 동작 전체 정지함
LDAssert.assert(condition, message);
LDAssert.notEmpty(any, message);
LDAssert.notZero(any, message);

8. lazyduck_ui
LDCheckToggle
LDOrder
LDTags
LDCategories
LDRadio

9. lazyduck_lang

2016/12/28일 업데이트
1. LDDataView 생성
생성된 View의 click 이벤트등을 내부에서 처리하기 힘들어서 만듬
LD Instance에 포함되어 있다
LD.getView(id);
LD.getValue(id);

2. templateLD를 추가
LDDataView의 gen 기능등을 합해서 편리하게 사용할수 있음
LDArea의 템플릿도 기본 templateLD로 변경됨
템플릿으로 생성된 모든 녀석들은 데이터가 저장되게 되어 있음
그리고 value에 id가 추가됨
onclick="onClick(<%= id %>)"
위와 같이 사용할수 있음

function onClick(id) {
	var value = this.getValue(id);
	var view = this.getView(id);
}

2016/12/29일 업데이트
1. ajaxSubmit file 처리 부분 추가 multipart일때 파일 날릴수 있음, 현재 다중 파일 처리는 안되어 있음
2. LDLang Ctrl+enter, 입력후 바로 바뀌는것 수정