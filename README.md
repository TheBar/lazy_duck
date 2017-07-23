JQuery Library LazyDuck

JQuery 기반 잦은 기능 코드 단축을 목표로함

Dependency :
JQuery 1.x / 2.x
underscore.js

구성 :
1. JQuery 확장 코드
2. LDForm
3. LDArea
4. LDDataView
5. LDListView
6. LDAssert
7. LDEvent
8. LDAssert

예 :

html
----
<pre>
<form id="formCreate" class="LDForm">
	<input type="text" name="search" />
</form>
</pre>

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
http://www.sdlabs.kr/lazyduck/

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

2017/03/02 업데이트
1. LDForm data-sync 추가 : editor 등에서 toJSON 이전에 호출되어야 할 sync 맞추기용, false 이면 submit 취소함

2017/06/29 업데이트
1. toJSON file이 없을 경우 추가하지 않음
2. toJSON file의 갯수만큼 form data에 append를 함 - 여러개의 파일을 올릴때 쓸수 있을듯 하나, 아직 테스트는 안해봄
3. ui checkbox 부분 추가됨 기존에 만들었는데 합치지 않았음
4. ui tag에서 data-value - default 기능 추가함, addValue하는걸로 해서 자연스럽게 처리가 됨

2017/07/23 업데이트
1. toJSON type Email 추가
2. LDForm.clear exclude 추가
3. LDDataView.getView data-id 보다 id를 우선시 찾음
4. LDDataView.removeView, removeValue 추가
5. .LDClick 기능 추가 - append 등으로 새로 추가되는 object에서 클릭 기능을 생성 - 부모가 window가 되어 버리는 문제가 있음
6. templateLD gen을 넣을지 말지 결정 가능 - listView 같은 경우 직접 생성하기 때문에 LD 자체의 gen을 사용할수 없다
7. LDEvent, LDStatus 추가 - 이벤트 리스너, 상태 변경, 둘다 observer