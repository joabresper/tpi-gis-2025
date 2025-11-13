export function activar_desactivar_capa(capas) {
	const check_boxes = document.querySelectorAll('.layers-panel input[type="checkbox"]');

	check_boxes.forEach((c) => {
		c.addEventListener('change', (e) => {
			const name = e.target.id;
			const layer = capas[name];

			if (!layer) return;

			layer.setVisible(e.target.checked);
		});
	});
}