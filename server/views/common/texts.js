<script type="text/javascript">
    window.Clima = {};
    Clima.lang = "{{ lang }}";
    Clima.texts = {{ ctx["textsJson"] | default("'template context does not have texts!'") }}
</script>
    
<script src="/common/js/jquery.js"></script>
<script src="/common/js/bootstrap_3.3.1.js"></script>
