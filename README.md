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
