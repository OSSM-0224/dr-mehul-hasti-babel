/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface ClinicLogoProps {
  className?: string;
  size?: number;
}

export default function ClinicLogo({ className = '', size = 48 }: ClinicLogoProps) {
  return (
    <svg 
      className={`shrink-0 transition-transform duration-300 group-hover:scale-105 ${className}`}
      width={size}
      height={size}
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Deep, glowing premium gradient resembling the blue/cyan tooth design */}
        <linearGradient id="toothGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" /> {/* Electric Cyan */}
          <stop offset="50%" stopColor="#2563eb" /> {/* Vivid Blue */}
          <stop offset="100%" stopColor="#3b82f6" /> {/* Radiant Slate Blue */}
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <g filter="url(#glow)">
        {/* Main upper majestic crown swoop */}
        <path 
          d="M439 65C380 43 285 71 217 122C149 173 113 226 95 285C77 344 79 383 103 408C127 433 162 438 181 432C200 426 211 412 189 367C167 322 178 261 228 200C278 139 349 98 411 90C450 85 455 71 439 65Z" 
          fill="url(#toothGradient)" 
        />

        {/* Dynamic sweeping root ribs on the left side */}
        <path 
          d="M62 201C49 220 38 245 42 272C46 299 65 318 80 326C95 334 105 331 92 313C79 295 72 271 78 249C84 227 98 209 105 204C112 199 108 191 100 193C87 196 75 182 62 201Z" 
          fill="url(#toothGradient)" 
          opacity="0.85"
        />
        
        <path 
          d="M45 278C30 300 21 328 29 358C37 388 59 407 76 414C93 421 102 417 87 398C72 379 66 352 74 327C82 302 96 283 103 277C110 271 105 264 97 267C85 272 58 259 45 278Z" 
          fill="url(#toothGradient)" 
          opacity="0.75"
        />

        <path 
          d="M58 359C46 379 40 403 48 428C56 453 74 468 89 472C104 476 111 471 97 455C83 439 80 415 88 394C96 373 107 358 113 353C119 348 113 341 106 344C98 348 70 340 58 359Z" 
          fill="url(#toothGradient)" 
          opacity="0.65"
        />

        {/* Elegant curved lower root on the right */}
        <path 
          d="M261 405C321 445 351 454 353 460C355 466 325 487 289 494C253 501 247 483 252 467C257 451 254 429 248 416C242 403 249 397 261 405Z" 
          fill="url(#toothGradient)" 
        />
        
        <path 
          d="M399 313C425 353 445 423 410 468C375 513 360 498 376 470C392 442 401 385 385 348C369 311 366 298 378 294C390 290 382 287 399 313Z" 
          fill="url(#toothGradient)" 
        />
      </g>
    </svg>
  );
}
