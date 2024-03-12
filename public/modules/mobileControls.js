export const createMobileControls = () => {
  // Buttons control for mobile devices
  if (isMobile) {
    // Create buttons for mobile controls
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'button-container';
    document.body.appendChild(buttonContainer);
    const buttonContainerInner = document.createElement('div');
    buttonContainerInner.id = 'button-container-inner';
    buttonContainer.appendChild(buttonContainerInner);
    function createButton(
      iconClass,
      className,
      touchStartAction,
      touchEndAction
    ) {
      const button = document.createElement('button');
      const icon = document.createElement('i');
      icon.className = `fas ${iconClass}`; // Use Font Awesome classes
      button.appendChild(icon);
      button.className = className; // Assign the class
      button.addEventListener('touchstart', touchStartAction);
      button.addEventListener('touchend', touchEndAction);
      return button;
    }

    const leftIconClass = 'fa-arrow-left';
    const rightIconClass = 'fa-arrow-right';
    const shootIconClass = 'fa-rocket';

    // <i class="fa-solid fa-rocket"></i>;
    // Create left button
    const leftButton = createButton(
      leftIconClass,
      'control-btn',
      () => {
        player.simulateKeyPress('ArrowLeft');
      },
      () => {
        player.simulateKeyRelease('ArrowLeft');
      }
    );

    // Create right button
    const rightButton = createButton(
      rightIconClass,
      'control-btn',
      () => {
        player.simulateKeyPress('ArrowRight');
      },
      () => {
        player.simulateKeyRelease('ArrowRight');
      }
    );

    // Create shoot button
    const shootButton = createButton(
      shootIconClass,
      'control-btn',
      () => {
        player.simulateKeyPress('Space');
      },
      () => {
        player.simulateKeyRelease('Space');
      }
    );

    // Append buttons to the container
    buttonContainerInner.appendChild(leftButton);
    buttonContainerInner.appendChild(rightButton);
    buttonContainer.appendChild(shootButton);
  }
};
