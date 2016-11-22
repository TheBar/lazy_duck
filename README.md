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