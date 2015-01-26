<script type="text/javascript">
    window.Clima = {};
    Clima.lang = "{{ lang }}";
    Clima.texts = {{ ctx["textsJson"] | default("'template context does not have texts!'") }}
</script>
    