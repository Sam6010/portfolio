import { Component, PLATFORM_ID, Inject, ElementRef, QueryList, ViewChildren, } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { isPlatformBrowser } from '@angular/common';
import Toast from 'bootstrap/js/dist/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('fadeInLeft', [
      state('hidden', style({ opacity: 0, transform: 'translateX(-50px)' })),
      state('visible', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('hidden => visible', animate('600ms ease-out'))
    ]),
    trigger('fadeInRight', [
      state('hidden', style({ opacity: 0, transform: 'translateX(50px)' })),
      state('visible', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('hidden => visible', animate('600ms ease-out'))
    ]),
    trigger('slideInFromLeft', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateX(-100%)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('hidden => visible', animate('800ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'))
    ]),
    trigger('slideInFromRight', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateX(100%)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('hidden => visible', animate('800ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'))
    ])
  ]
})
export class AppComponent {
  @ViewChildren('projectContainer') projectContainers!: QueryList<ElementRef>;
  @ViewChildren('experienceCard') experienceCards!: QueryList<ElementRef>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private _fb: FormBuilder) {
    this.InitializeForm()
  }

  title = 'portfolio';
  toastType: string = ''
  contactForm!: FormGroup
  // Create separate animation states for each project
  projectAnimationStates: { [key: string]: string } = {
    vaahna: 'hidden',
  };


  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Small delay to ensure DOM is fully rendered
      setTimeout(() => {
        this.setupIntersectionObserver();
      }, 100);
    }
  }

  scrollToDiv(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  }

  InitializeForm() {
    this.contactForm = this._fb.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      subject: new FormControl('', [Validators.required]),
      message: new FormControl('', [Validators.required])
    })
  }

  submitForm() {
    console.log(this.contactForm.value);
    const toastEl = document.getElementById('copyToast');
    if (toastEl) {
      this.toastType = "Thanks for your response ..!"
      const toast = new Toast(toastEl);
      toast.show();
    }
    this.contactForm.reset()
  }

  private setupIntersectionObserver(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const projectId = target.getAttribute('data-project-id');

            if (projectId && this.projectAnimationStates[projectId] == 'hidden') {
              this.projectAnimationStates[projectId] = 'visible';
              // Unobserve this specific element
              observer.unobserve(target);
            }

          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is fully visible
      }
    );


    // Observe each project container
    this.projectContainers.forEach((container) => {
      observer.observe(container.nativeElement);
    });
  }

  // Helper method to get animation state for specific project
  getAnimationState(projectId: string): string {
    return this.projectAnimationStates[projectId] || 'hidden';
  }


  copy(text: any) {
    navigator.clipboard.writeText(text);
    if (text.includes('+91')) {
      this.toastType = "Phone number copied to clipboard ..!"
    } else {
      this.toastType = "Email Id copied to clipboard ..!"
    }

    const toastEl = document.getElementById('copyToast');
    if (toastEl) {
      const toast = new Toast(toastEl);
      toast.show();
    }
  }
}
