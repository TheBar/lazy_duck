JQuery Library LazyDuck

JQuery ��� ���� ��� �ڵ� ������ ��ǥ����

Dependency :
JQuery 1.x / 2.x
underscore.js

���� :
1. JQuery Ȯ�� �ڵ�
2. LDForm
3. LDArea
4. LDData

�� :

html
----
<form id="formCreate" class="LDForm">
	<input type="text" name="search" />
</form>

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