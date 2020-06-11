if (document.readyState == 'loading') {
  document.getElementById('main-css').addEventListener('load', ready)
} else {
  ready()
}

function ready() {
  FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
  )

  FilePond.setOptions({
    // set ratio according to "cover" input field (_form_field)
    stylePanelAspectRatio: 150 / 100,
    imageResizeTargetWidth: 100,
    imageResizeTargetHeight: 150
  })

  FilePond.parse(document.body)
}